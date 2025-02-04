import { Registry } from '@bem-react/di';

import { Explorer } from '../components/Explorer/Explorer';
import { FormControl } from '../components/Form/Control/Form-Control.composed';
import { Form } from '../components/Form/Form';
import { FormView } from '../components/Form/View/Form-View.composed';
import { FormDialog } from '../components/FormDialog/FormDialog';
import { LibraryDocument } from '../components/LibraryDocument/LibraryDocument';
import { LibraryDocumentActions } from '../components/LibraryDocumentActions/LibraryDocumentActions';
import { LibraryRegistry } from '../components/LibraryRegistry/LibraryRegistry';

export const registry = new Registry({ id: 'common' });

const dependencies = {
  Explorer,
  Form,
  FormView,
  FormDialog,
  FormControl,
  LibraryDocument,
  LibraryDocumentActions,
  LibraryRegistry
};

export type CommonDiRegistry = typeof dependencies;

registry.fill(dependencies);
