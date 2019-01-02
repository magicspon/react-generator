'use strict'

const path = require('path')

const getRelativePath = (data, ext = '.js') => {
  let relativePath =
    'src/components/{{properCase name}}/{{properCase name}}' + ext

  return path.resolve(process.cwd(), relativePath)
}

module.exports = {
  description: 'Add component',
  prompts: [
    {
      type: 'list',
      name: 'type',
      message: 'Select the type of component',
      default: 'Stateless',
      choices: () => ['Stateless', 'Component'],
    },
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      validate: value => {
        if (/.+/.test(value)) {
          return true
        }
        return 'name is required'
      },
    },
    {
      type: 'confirm',
      name: 'cssModules',
      default: true,
      message: 'Do you want to use css modules?',
    },
    {
      type: 'list',
      name: 'docs',
      message: 'Do you want to scaffold your documentation?',
      default: 'Both',
      choices: () => ['Storybook', 'Docz', 'Both', 'None'],
    },
    {
      type: 'confirm',
      name: 'snapshot',
      default: true,
      message: 'Do you want to create a snapshot test?',
    },
    {
      type: 'confirm',
      name: 'connectedComponent',
      default: false,
      message: 'Do you want a connected component?',
    },
  ],
  actions: data => {
    // Generate index.js and index.test.js
    let componentTemplate

    switch (data.type) {
      case 'Stateless': {
        componentTemplate = path.resolve(__dirname, 'stateless.js.hbs')
        break
      }
      case 'Component': {
        componentTemplate = path.resolve(__dirname, 'component.js.hbs')
        break
      }
      default: {
        componentTemplate = path.resolve(__dirname, 'stateless.js.hbs')
      }
    }

    const actions = [
      {
        type: 'add',
        path: getRelativePath(data, '.js'),
        templateFile: componentTemplate,
        abortOnFail: true,
      },
    ]

    if (data.cssModules) {
      actions.push({
        type: 'add',
        path: getRelativePath(data, '.module.css'),
        templateFile: path.resolve(__dirname, 'style.css.hbs'),
        abortOnFail: true,
      })
    }

    if (data.docs !== 'None') {
      const storybook = {
        type: 'add',
        path: getRelativePath(data, '.story.js'),
        templateFile: path.resolve(__dirname, 'story.js.hbs'),
        abortOnFail: true,
      }

      const docz = {
        type: 'add',
        path: getRelativePath(data, '.mdx'),
        templateFile: path.resolve(__dirname, 'docz.mdx.hbs'),
        abortOnFail: true,
      }

      const options = {
        Both: [storybook, docz],
        Storybook: [storybook],
        Docz: [docz],
      }

      actions.push(...options[data.docs])
    }

    if (data.snapshot) {
      actions.push({
        type: 'add',
        path: getRelativePath(data, '.snapshot.test.js'),
        templateFile: path.resolve(__dirname, 'story.js.hbs'),
        abortOnFail: true,
      })
    }

    return actions
  },
}
