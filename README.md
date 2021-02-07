# Debug

## Requirements
After cloning this repository you need to install all the dependencies, to do this go to a terminal on the root of the project and run:
```bash
yarn install
```

The fastest way to get up and running is to use the Expo client app on your iOS or Android device. Expo client allows you to open up apps that are being served through Expo CLI.

- 🤖 [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) - Android Lollipop (5) and greater.
- 🍎 [iOS App Store](https://itunes.com/apps/exponent) - iOS 10 and greater.

When the Expo client is finished installing, open it up. If you created an account with `expo-cli` then you can sign in here on the "Profile" tab. This will make it easier for you to open projects in the client when you have them open in development &mdash; they will appear automatically in the "Projects" tab of the client app.

> 👉 It's often useful to be able to run your app directly on your computer instead of on a separate physical device. If you would like to set this up, you can learn more about [installing the iOS Simulator (macOS only)](../workflow/ios-simulator.md) and [installing an Android emulator](../workflow/android-studio-emulator.md).


## Running the app
Go to a terminal on the root of the project and run:
```bash
yarn start
```
`expo-cli` will be executed for you and the app is ready to be executed on the platform of your choise by pressing `i` (iOS) or `a` (android)

# Experiments on this project

All experiments are focused on animations and gestures.

## Sorted List (WIP)
Drag<strike>&drop</strike> items on a list while you keep the posibility of scroll over the elements.

## Draggable Stickies 
Sticky notes you can drag&drop and also resize. 

## Twitter 
 - Pseudo-sticky header. It disappears when you scroll down and appears again as soon as you scroll up. 
 - Micro-interaction on "like" icon using Lottie.


## Animated Wave
Just an animated SVG.

## Magnet
A box that sticks to the borders if is leave too close to them.

## Photo Albums
A photos app with nice transitions between screens using [react-navigation](https://reactnavigation.org/) and [react-navigation-shared-element](https://github.com/IjzerenHein/react-navigation-shared-element)
