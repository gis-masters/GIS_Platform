import * as fs from 'node:fs';
import * as path from 'node:path';
import { addProperty } from '@wdio/junit-reporter';
import type { JUnitReporterOptions } from '@wdio/junit-reporter/build/types.js';

type XmlAttributes = Record<string, string>;

interface ParsedTestCase {
  attributes: XmlAttributes;
  innerXml: string;
}

interface ParsedSuite {
  attributes: XmlAttributes;
  featureName: string;
  testCases: ParsedTestCase[];
}

interface TagContent {
  attributes: string;
  innerXml: string;
}

const junitOutputDir = path.resolve(process.cwd(), 'tests/_reports/junit');
const mergedSuiteName = 'portal-ui.e2e.RunCucumberTest';
const mergedXmlFileName = `TEST-${mergedSuiteName}.xml`;
const mergedTxtFileName = `${mergedSuiteName}.txt`;
const xmlAttributePattern = /([:_a-z][\w.:-]*)="([^"]*)"/gi;
const propertyTagPattern = /<property\s+([^>]*)\/>/g;

function getBrowserName(capabilities: unknown): string {
  if (
    typeof capabilities === 'object' &&
    capabilities !== null &&
    'browserName' in capabilities &&
    typeof capabilities.browserName === 'string'
  ) {
    return capabilities.browserName;
  }

  return 'browser';
}

function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function decodeXml(text: string): string {
  return text
    .replaceAll(/&#x([\da-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replaceAll(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}

function parseAttributes(rawAttributes: string): XmlAttributes {
  const attributes: XmlAttributes = {};

  for (const match of rawAttributes.matchAll(xmlAttributePattern)) {
    const [, key, value] = match;
    attributes[key] = value;
  }

  return attributes;
}

function getPropertyValue(xml: string, name: string): string | undefined {
  for (const match of xml.matchAll(propertyTagPattern)) {
    const [, rawAttributes] = match;
    const attributes = parseAttributes(rawAttributes);

    if (attributes.name === name) {
      return attributes.value;
    }
  }

  return undefined;
}

function escapeRegExp(text: string): string {
  return text.replaceAll(/[$()*+.?[\\\]^{|}]/g, '\\$&');
}

function stripPropertyByName(xml: string, propertyName: string): string {
  return xml.replaceAll(
    new RegExp(`<property\\s+[^>]*name="${escapeRegExp(propertyName)}"[^>]*/>\\s*`, 'g'),
    ''
  );
}

function toNumber(value: string | undefined): number {
  if (!value) {
    return 0;
  }

  const parsedValue = Number.parseFloat(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function formatDuration(seconds: number): string {
  return (Math.round(seconds * 1000) / 1000).toFixed(3);
}

function normalizeClassname(value: string): string {
  return value.replaceAll(/\s+/g, '_');
}

function serializeAttributes(attributes: XmlAttributes): string {
  return Object.entries(attributes)
    .map(([key, value]) => ` ${key}="${escapeXml(value)}"`)
    .join('');
}

function getTagContents(xml: string, tagName: string): TagContent[] {
  const tagContents: TagContent[] = [];
  const openTagPattern = new RegExp(`<${escapeRegExp(tagName)}(?=[\\s>/])`, 'g');
  const closeTag = `</${tagName}>`;
  let match = openTagPattern.exec(xml);

  while (match) {
    const openTagStart = match.index;
    const openTagEnd = xml.indexOf('>', openTagStart);

    if (openTagEnd === -1) {
      return tagContents;
    }

    const rawAttributes = xml.slice(openTagStart + tagName.length + 1, openTagEnd);
    const attributes = rawAttributes.replaceAll(/\/\s*$/g, '');

    if (/\/\s*$/.test(rawAttributes)) {
      tagContents.push({ attributes, innerXml: '' });
      openTagPattern.lastIndex = openTagEnd + 1;
      match = openTagPattern.exec(xml);

      continue;
    }

    const closeTagStart = xml.indexOf(closeTag, openTagEnd + 1);

    if (closeTagStart === -1) {
      return tagContents;
    }

    tagContents.push({
      attributes,
      innerXml: xml.slice(openTagEnd + 1, closeTagStart)
    });

    openTagPattern.lastIndex = closeTagStart + closeTag.length;
    match = openTagPattern.exec(xml);
  }

  return tagContents;
}

function parseSuites(xml: string): ParsedSuite[] {
  return getTagContents(xml, 'testsuite').map(({ attributes: rawAttributes, innerXml }) => {
    const testCases = getTagContents(innerXml, 'testcase').map(({ attributes, innerXml: testCaseInnerXml }) => {
      return {
        attributes: parseAttributes(attributes),
        innerXml: testCaseInnerXml
      };
    });

    return {
      attributes: parseAttributes(rawAttributes),
      featureName: decodeXml(getPropertyValue(innerXml, 'featureName') ?? ''),
      testCases
    };
  });
}

function rewriteTestCase(testCase: ParsedTestCase, featureName: string): string {
  const scenarioName = decodeXml(getPropertyValue(testCase.innerXml, 'scenarioName') ?? '');
  const currentName = decodeXml(testCase.attributes.name ?? '');
  const currentClassname = decodeXml(testCase.attributes.classname ?? '');
  const name = currentName || scenarioName || featureName || 'Scenario';
  const classname = currentClassname && !currentClassname.endsWith('.')
    ? currentClassname
    : `portal-ui.e2e.${normalizeClassname(featureName || name)}`;
  const cleanedInnerXml = stripPropertyByName(testCase.innerXml, 'scenarioName');

  return `  <testcase${serializeAttributes({ ...testCase.attributes, classname, name })}>${cleanedInnerXml}</testcase>`;
}

export const junitReporterConfig: JUnitReporterOptions = {
  outputDir: './tests/_reports/junit',
  outputFileFormat: ({ cid, capabilities }) => {
    return `wdio-${getBrowserName(capabilities)}-${cid}.xml`;
  },
  suiteNameFormat: ({ suite }) => suite.title,
  classNameFormat: ({ activeFeatureName }) => {
    return `portal-ui.e2e.${normalizeClassname(activeFeatureName || 'scenario')}`;
  }
};

export function prepareJunitReportingDir(): void {
  fs.mkdirSync(junitOutputDir, { recursive: true });

  for (const entry of fs.readdirSync(junitOutputDir)) {
    if (entry.endsWith('.xml') || entry.endsWith('.txt')) {
      fs.rmSync(path.join(junitOutputDir, entry), { force: true });
    }
  }
}

export function addScenarioNameToJunit(scenarioName: string | undefined): void {
  if (scenarioName) {
    addProperty('scenarioName', scenarioName);
  }
}

export function mergeJunitReports(): void {
  fs.mkdirSync(junitOutputDir, { recursive: true });

  const rawXmlFiles = fs
    .readdirSync(junitOutputDir)
    .filter(fileName => fileName.endsWith('.xml') && !fileName.startsWith('TEST-'))
    .sort();

  let tests = 0;
  let failures = 0;
  let errors = 0;
  let skipped = 0;
  let totalTime = 0;
  const mergedTestCases: string[] = [];

  for (const fileName of rawXmlFiles) {
    const content = fs.readFileSync(path.join(junitOutputDir, fileName), 'utf8');
    const suites = parseSuites(content);

    for (const suite of suites) {
      if (suite.testCases.length === 0) {
        continue;
      }

      tests += Math.max(toNumber(suite.attributes.tests), suite.testCases.length);
      failures += toNumber(suite.attributes.failures);
      errors += toNumber(suite.attributes.errors);
      skipped += toNumber(suite.attributes.skipped);
      totalTime += toNumber(suite.attributes.time);

      for (const testCase of suite.testCases) {
        mergedTestCases.push(rewriteTestCase(testCase, suite.featureName));
      }
    }
  }

  const mergedXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<testsuite xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="https://maven.apache.org/surefire/maven-surefire-plugin/xsd/surefire-test-report.xsd" version="3.0.2" name="${escapeXml(mergedSuiteName)}" time="${formatDuration(totalTime)}" tests="${tests}" errors="${errors}" skipped="${skipped}" failures="${failures}">`,
    '  <properties>',
    '    <property name="reporter" value="wdio-junit-merged"/>',
    `    <property name="reportDirectory" value="${escapeXml('./tests/_reports/junit')}"/>`,
    '  </properties>',
    ...mergedTestCases,
    '</testsuite>',
    ''
  ].join('\n');

  const mergedTxt = [
    '-------------------------------------------------------------------------------',
    `Test set: ${mergedSuiteName}`,
    '-------------------------------------------------------------------------------',
    `Tests run: ${tests}, Failures: ${failures}, Errors: ${errors}, Skipped: ${skipped}, Time elapsed: ${formatDuration(totalTime)} s -- in ${mergedSuiteName}`,
    ''
  ].join('\n');

  fs.writeFileSync(path.join(junitOutputDir, mergedXmlFileName), mergedXml, 'utf8');
  fs.writeFileSync(path.join(junitOutputDir, mergedTxtFileName), mergedTxt, 'utf8');

  for (const fileName of rawXmlFiles) {
    fs.rmSync(path.join(junitOutputDir, fileName), { force: true });
  }
}
