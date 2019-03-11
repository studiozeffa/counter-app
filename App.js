// We must import react whenever we use JSX, even though
// we aren't actually using the `React` import anywhere in this file.
// The reason here is that any JSX code will be transformed into
// calls such as `React.createElement`, which would fail if
// `React` wasn't imported.
// We also import `Component` as the Counter is a React Class Component.
import React, { Component } from 'react';

// In browser-based React apps, we render HTML elements such as
// `div`, `span`, `p`, etc.
// React Native does not render to a browser, so we cannot use HTML elements.
// Instead, we render React Native elements such as `View`, `Text` and `Image`.
// Under the hood, React Native will render these components as the target
// platform's native components.
// This is all handled for you, so all you need to worry about is
// rendering a React Native component, and React Native will take care
// of the rest - no native code required.
import { StyleSheet, Text, View, Image, TouchableHighlight, FlatList } from 'react-native';

// moment is a popular JavaScript library for working with dates and times.
// Since React Native is written with JavaScript, you can use many of
// the existing JavaScript libraries available on npm.
import moment from 'moment';

// We import the image of Count von Count here.
// Importing images in React Native uses a different syntax:
// instead of `import` we use `require`.
// If you look in the filesystem, you'll notice that although we
// are requiring 'count.jpg', there isn't a file matching this name.
// Instead, we have three files: `count@1x.jpg`, `count@2x.jpg` and
// `count@3x.jpg`. The reason for this is that different mobile devices
// use different 'pixel densities'. A higher pixel density requires
// a larger image size to fit in the same physical space on screen.
// React Native takes care of all of this for us - if you stick to the
// `@nx` naming convention, React Native will choose the correct file
// according to the pixel density of the device.
// For more details on pixel densities in mobile devices, see here:
// https://medium.com/@pnowelldesign/pixel-density-demystified-a4db63ba2922
const countImage = require('./count.jpg');

// The CounterHistoryItem is a stateless component which is
// rendered inside the History list. It is responsible for
// taking the history item and rendering out text,
// describing when the action was taken, and what the action was.
const CounterHistoryItem = ({item}) => {
  // The `item` prop contains 4 properties. We use ES6 destructuring
  // syntax to pull these properties out as constants.
  // https://is.gd/iccJAj
  const { timestamp, operation, before, after } = item;

  // The `dateOfOperation` text takes the form of (e.g.)
  // 'Today at 10:03 AM'. We use the moment `calendar` method
  // to generate this from the raw timestamp of the operation.
  // https://momentjs.com/docs/#/displaying/calendar-time/
  const dateOfOperation = moment(timestamp).calendar();

  // The remainder of the text is built up using an ES6 template string.
  // https://is.gd/dD9rOl
  const didOperation = operation === 'increment' ? 'Incremented' : 'Decremented';
  const text = `${dateOfOperation}: ${didOperation} from ${before} to ${after}`

  // Finally we return the text inside a 'Text' React Native component.
  return <Text>{text}</Text>;
}

// The CounterButton is a stateless component which renders a
// button, to increment or decrement the counter.
// It accepts three props:
//  - `label`: the text label to go inside the button.
//  - `onPress`: a function to call when the button is pressed.
//  - `disabled`: a boolean indicating whether the button should
//    be disabled or not. A disabled button will not call the
//    `onPress` handler when the button is pressed.
//
// This component uses the short form of the stateless functional
// component style - it directly returns the JSX to render.
// It uses the `TouchableOpacity` React Native component,
// styled using the `styles` stylesheet definition.
//
// Notice the `style` prop: this uses the array form,
// which allows you to pass in multiple styles.
// The button here is passed the base `counterButton` style,
// and if the button is disabled, the `counterButtonDisabled` style
// is also applied.
const CounterButton = ({label, onPress, disabled}) => (
  <TouchableHighlight
    style={[styles.counterButton, disabled ? styles.counterButtonDisabled : null]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.counterButtonText}>{label}</Text>
  </TouchableHighlight>
)

// The parent component is the Counter.
// It is defined as a Component Class since it uses state, and
// class methods to handle the button press events
// and render the items in the history list.
export default class Counter extends Component {
  constructor(props) {
    super(props);

    // Our state is set up with the two pieces of information,
    // to track the current counter value and the historical values.
    this.state = {
      counterValue: 0,
      history: []
    }

    // JavaScript classes are a bit funky.
    // If you pass a method definition directly to an
    // onPress handler, the value of `this` will be undefined.
    // To get around this, we use the Function bind method
    // to ensure that `this` will always point to this class,
    // regardless of how it is called.
    // https://reactjs.org/docs/handling-events.html
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }

  // This method will be called when the `increment` button
  // is pressed. Here, we will:
  // - increment the counter value by 1
  // - add an entry to the history array
  increment() {
    this.updateCounter('increment');
  }

  // This method will be called when the `decrement` button
  // is pressed. Here, we will:
  // - decrement the counter value by 1
  // - add an entry to the history array
  decrement() {
    this.updateCounter('decrement');
  }

  updateCounter(operation) {
    // We take a copy of the current amount for history tracking.
    const currentAmount = this.state.counterValue;

    // Then, we calculate the next amount, according to the operation
    // that was passed in (increment/decrement).
    const nextAmount = operation === 'increment' ?
      currentAmount + 1 :
      currentAmount - 1;

    // Finally, set the new state values with `this.setState`.
    this.setState({
      counterValue: nextAmount,
      // To return a new history array, we use the array
      // spread operator. This allows us to take each object
      // in the array and put them, in order, into the new one.
      // Finally, to append a new object to the array,
      // we include the new object before the spread.
      // https://is.gd/sAT6e5
      history: [
        {
          timestamp: Date.now(),
          operation,
          before: currentAmount,
          after: nextAmount
        },
        ...this.state.history
      ]
    });
  }

  // Here, we render the entire Counter screen, which consists of:
  //  - Title text
  //  - An image of Count von Count
  //  - The counter buttons and current value
  //  - The list of actions (history)
  // Everything is styled as per the StyleSheet definition
  // at the bottom of the file.
  render() {
    const { counterValue, history } = this.state;

    // Note the CounterButton props:
    //  - `onPress` is assigned to `this.increment` or `this.decrement`.
    //    We bound these methods in the constructor, so `this` will
    //    point to the correct place when these methods are called.
    //  - The `disabled` flag is set according to the value of the counter:
    //    this stops the counter from being decremented below 0 or
    //    incremented above 10.
    return (
      <View style={styles.container}>
        <Text style={styles.title}>The Count</Text>
        <Image style={styles.image} source={countImage} />
        <View style={styles.counter}>
          <CounterButton label="–" onPress={this.decrement} disabled={counterValue === 0} />
          <View style={styles.counterTextContainer}>
            <Text style={styles.counterText}>{counterValue}</Text>
          </View>
          <CounterButton label="+" onPress={this.increment} disabled={counterValue === 10} />
        </View>
        <Text style={styles.historyHeading}>History</Text>
        <FlatList
          style={styles.historyList}
          data={history}
          renderItem={this.renderHistoryItem}
          keyExtractor={this.extractHistoryItemKey} />
      </View>
    );
  }

  // This is called by the `FlatList` component for each item
  // in the `history` array, and is responsible for returning
  // an element to be rendered in each row of the list.
  // It accepts a single argument,  an object containg an `item`
  // property. This is extracted using ES6 destructuring and made
  // available as an `item` variable inside the function.
  // We take this item and render a CounterHistoryItem component.
  //
  // Also notice that since we are not using `this` anywhere inside
  // the method, we don't need to use `bind` in the constructor,
  // unlike the `increment` and `decrement` methods.
  renderHistoryItem({item}) {
    return <CounterHistoryItem item={item} />;
  }

  // This is called by the `FlatList` component for each item
  // in the `history` array, and is responsible for returning
  // a unique key for each row in the list.
  // Keys are important when rendering a list, since React uses
  // them for performance reasons.
  // https://reactjs.org/docs/lists-and-keys.html
  //
  // The method accepts a single argument, the item of the row.
  // We take this item and return the timestamp of the history item,
  // which we can safely assume to be unique (since noone will be able
  // to generate 2 history items in the same millisecond).
  //
  // We use a string template to convert the number into a string,
  // since a React key must be a string.
  extractHistoryItemKey(item) {
    return `${item.timestamp}`;
  }
}

// The styles for the components live here.
// Firstly, we define some common variables:
// colors, fontSizes and viewStyles.
const colors = {
  primary: '#5a2961',
  midGrey: '#999',
  white: '#fff'
}

const fontSizes = {
  huge: 32,
  large: 18
}

const baseMargin = 4;

const headingTextStyle = {
  color: colors.primary,
  fontWeight: 'bold',
}

const counterTextStyle = {
  fontSize: fontSizes.huge,
  lineHeight: 36
}

// Here we generate a set of styles which are used
// with the `style` tag on a React Native component.
// Style definitions are similar to CSS styles,
// but are defined using `camelCase` instead of
// `kebab-case`.
// Different React Native components are styled
// using different definitions.
// https://facebook.github.io/react-native/docs/style.html
const styles = StyleSheet.create({
  // The `container` style is used for a `View`.
  container: {
    // Space out the top to make room for the statusbar.
    paddingTop: 20,
    // Ensure the container takes up the whole screen.
    flex: 1,
    // Give the screen a white background.
    backgroundColor: colors.white,
    // Center the children horizontally.
    // Remember that React Native sets a `flexDirection`
    // of 'column' by default, this is different to the web.
    alignItems: 'center',
  },
  title: {
    // Apply all of the properties from `headingTextStyle`.
    // This is spread syntax: https://is.gd/sAT6e5
    // It is equivalent to writing out:
    //  color: colors.primary,
    //  fontWeight: 'bold',
    ...headingTextStyle,
    // Set the fontSize
    fontSize: fontSizes.huge,
    // Give the title some vertical spacing
    marginVertical: baseMargin * 4
  },
  image: {
    // Give the image a set width and height.
    // Without this, the image will be rendered
    // at its native dimensions
    // (i.e. whatever size the image actually is)
    width: 240,
    height: 160
  },
  counter: {
    // We lay the children of the `counter` out horizontally.
    // The default in React Native is vertical layout ('column')
    flexDirection: 'row',
    marginVertical: baseMargin * 4,
    alignItems: 'center'
  },
  counterButton: {
    width: 50,
    height: 50,
    backgroundColor: colors.primary,
    // Give the button rounded corners
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  counterButtonDisabled: {
    backgroundColor: colors.midGrey
  },
  counterButtonText: {
    ...counterTextStyle,
    color: colors.white
  },
  counterTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100
  },
  counterText: {
    ...counterTextStyle,
    color: colors.primary
  },
  historyHeading: {
    ...headingTextStyle,
    fontSize: fontSizes.large,
    marginVertical: baseMargin * 3,
  },
  historyList: {
    flex: 1,
    width: '100%',
    paddingLeft: 10
  }
});
