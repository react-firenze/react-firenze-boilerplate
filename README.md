<p align="center">
  <img width="200" src="http://i63.tinypic.com/et7ji1.jpg" alt="redux-firenze-logo">
</p>

# React Firenze Boilerplate (Core)

The first of a series of boilerplates that will allow full customization based on your needs. No more browsing to find the perfect boilerplate, what if you could simply generate a starter kit based on what you need and no unnecessary noise ?

On top of that a full commentary is provided in a separate branch to help you understand every single part of  the configuration. You won't need to blindly make changes or read through a config file without knowing what that specific line is for.

This project was born from the frustration of having many (amazing) starter kits like `create-react-app` or `react-boilerplate` with a lot going on that can feel overwhelming. This applies especially for beginners who want to get started quickly but also care about understanding what is going on under the hood.

While `create-react-app` is an outstanding tool to get up and running in an instant, it also abstracts the whole configuration from you. This means that you won't be able to fiddle with it unless you `eject`, and even then you need to know what you're doing (or read one of the many great blog posts about how to get that specific feature you really want in your app).

On the other hand `react-boilerplate` specifically states:

> Please note that this boilerplate is production-ready and not meant for beginners!

And despite the fact that it's been developed by people who really know what they're doing, it still feels bloated with many additional features that are really great to have, but might not be what you are looking for. This has the effect of adding a lot of noise which tends to scare beginners away.

## Problem

Many of the boilerplates or starter-kits out there have a high entry barrier for beginners. This applies to developers who want to be able to build an app quickly, and don't like having a configration that feels like a black box.

## Solution

Provide a tool that allows for custom boilerplates creation where developers can opt-in to specific features, based on their needs. This project has the goal of taking the word `opinionated` out of the boilerplates and to empower beginners (or really anyone) during the creation and undersantindg of their own starting project.

## Features (Core)

This repo will hold the very first boilerplate of the series, for simplicity it's called `Core`. Let's dig into the many features provided:

- **Clean Config**: The bulk of the webpack configuration resides in the `config` folder. There we leverage the use of `webpack-parts` to build small reusable preconfigured snippets that you can plug into any configuration to build the perfect setup. A separate repo will be setup so you can easily import them in any boilerplate.

- **Hot Reload**: Hot relaod works not only with any code or style change but it's also setup for redux! Start coding and save to see your app auto refresh without losing its current state.

- **State Management**: The boilerplate is setup with `redux` to manage the state of the app. Keep in mind that you don't need to "redux all the things", find a good balance and if you don't need it take it out (or use a different boilerplate that will be created soon to cover your use case).

- **Async Actions**: Use a simple middleware like `redux-slim-async` to reduce the boilerplate in coding an asynchronous action. It will allow you to track the state of it which can then be used to keep your components up to date.

- **Styling with Glamorous**: Glamorous brings a lot of value to the styling of your components, it uses javascript object notation to create styled components.

- **Test with Jest**: A minimal setup is provided to allow testing with Jest!


- **Server Side Rendering**: A simple server side rendering is used to allow fast response time on first load. A few techinques are implemented to inject styles as well from the server which are then rehydrated.

- **Next generation Javascript**: Babel is used to allow the use of the latest javascript fetures, using the `env` preset allows to specify custom support for browser which in turn will make your bundle smaller and smaller as more browser will add support for newer features

- **Environmental variables**: Use `.env` files to allow for usage of environmental variable during development.

- **Aliases**: Tired of referencing a component in an import with `../../components/MyComponent` ? We have aliases setup so that you can simply do `components/MyComponent` and not have to worry about it, this also applies to images, containers, ... and really anything you want by updating the config.

## Get Started

1. Clone this repo using `git clone https://github.com/react-firenze/react-firenze-boilerplate.git`
2. Dir into the right folder: `cd react--firenze-boilerplate`
3. Run `npm install` in order to install dependencies.
4. Start developing with `npm run dev` and enjoy the Nyan cat while webpack runs!

## License
This project is licensed under the MIT license, Copyright (c) 2018 Gabriele Cimato.
