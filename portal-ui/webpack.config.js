const path = require('path');

module.exports = {
  // Не вешать watcher на зависимости — иначе на Linux часто ENOSPC (лимит inotify).
  watchOptions: {
    ignored: /node_modules/
  },
  module: {
    rules: [
      // Правило для SCSS, импортируемых из React компонентов (.tsx файлы)
      {
        test: /\.scss$/,
        // Только для файлов, импортируемых из .tsx
        issuer: /\.tsx$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'src')]
              },
              implementation: require('sass')
            }
          }
        ]
      },
      // Правило для CSS, импортируемых из .tsx или .ts (но не .component.ts)
      {
        test: /\.css$/,
        // Применяем только к CSS, которые НЕ используются Angular
        resourceQuery: /^(?!.*\?(ngResource|ngGlobalStyle)).*$/,
        issuer: {
          and: [/\.tsx?$/], // .ts или .tsx
          not: [/\.component\.ts$/] // но НЕ .component.ts
        },
        use: ['style-loader', 'css-loader']
      },
      // Правило для CSS из node_modules, импортируемых из Angular компонентов
      {
        test: /\.css$/,
        include: /node_modules/,
        issuer: /\.component\.ts$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
