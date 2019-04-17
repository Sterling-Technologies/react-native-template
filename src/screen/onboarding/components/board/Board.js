import React, { Component } from 'react';

// Native dependencies
import {
  Animated,
  Dimensions,
  StyleSheet,
  View
} from 'react-native';

// Get device width
const deviceWidth = Dimensions.get('window').width;
// Get device height
const deviceHeight = Dimensions.get('window').height;

// Content component
import Content from './Content';

// Compoenent defaults
const defaults = {
  dotColor: '#C9C9C9',
  dotActiveColor: '#3A3F43',
  dotSize: 8,
  dotActiveSize: 11,
  noop: () => {}
};

/**
 * Board Component
 *
 * @type {*Object}
 */
class Board extends Component {
  /**
   * Initialize props and state
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: props.backgroundColor,
      pages: props.pages,
      index: 0,
      dotColor: props.dotColor ? defaults.dotColor : props.dotColor,
      dotActiveColor: props.dotActiveColor ? props.dotActiveColor : defaults.dotActiveColor,
      onEndCallback: props.onEnd ? props.onEnd : defaults.noop
    };

    // Set initial scroll x
    this.scrollX = new Animated.Value(0);

    // Bind events
    this.handleNext = this.handleNext.bind(this);
    this.onScrollEnd = this.onScrollEnd.bind(this);
  }

  /**
   * Handles Next
   *
   * @param {String} action
   */
  handleNext(action) {
    // Get the current index
    let current = this.state.index;

    console.log('current', current);
    console.log('index', this.state.pages.length);

    // Should end here
    if (current === this.state.pages.length - 1) {
      // Trigger end event for further actions
      console.log('isEnd');
      this.state.onEndCallback();
      return;
    }

    // Update current index
    if (action === 'skip') {
      // do this if the action === 'skip'
      current = this.state.pages.length - 1;
    } else {
      current = current + 1;
    }

    // Update state
    this.setState({ index: current });

    // Scroll page to index
    this.scrollView._component.scrollTo({
      x: deviceWidth * current,
      animated: true
    });
  }

  /**
   * Renders the dynamic content
   */
  renderContent() {
    return this.state.pages.map((value, index) => {
      return (
        <Content
          key={index}
          index={index}
          backgroundColor={value.backgroundColor}
          titleColor={value.titleColor}
          subtitleColor={value.subtitleColor}
          image={value.image}
          title={value.title}
          subtitle={value.subtitle}
          nextBackground={value.nextBackground}
          nextColor={value.nextColor}
          nextText={value.nextText}
          onNext={this.handleNext.bind(this, 'skip')}
        />
      );
    });
  }

  /**
   * Renders the progress dots
   */
  renderDots() {
    // Get the scroll x position via animated to support interpolation
    let position = Animated.divide(this.scrollX, deviceWidth);

    return this.state.pages.map((value, index) => {
      // Interpolate background color
      let backgroundColor = position.interpolate({
        // Set background color if index = +/- value
        inputRange: [index - 0.50000000001, index - 0.5, index, index + 0.5, index + 0.50000000001],
        // Set output range based on input range
        outputRange: [
          this.state.dotColor,
          this.state.dotActiveColor,
          this.state.dotActiveColor,
          this.state.dotActiveColor,
          this.state.dotColor,
        ],
        // Avoid going beyond the criteria
        extrapolate: 'clamp'
      });

      // Interpolate size for dots
      let size = position.interpolate({
        // Set size if index = +/- value
        inputRange: [index - 0.50000000001, index - 0.5, index, index + 0.5, index + 0.50000000001],
        // Set output range based on input range
        outputRange: [
          defaults.dotSize,
          defaults.dotActiveSize,
          defaults.dotActiveSize,
          defaults.dotActiveSize,
          defaults.dotSize,
        ],
        // Avoid going beyond the criteria
        extrapolate: 'clamp'
      });

      return (
        <Animated.View
          key={index}
          style={
            index === this.state.index ?
            [
              styles.defaultDot,
              styles.activeDot,
              {
                backgroundColor,
                borderRadius: size,
                height: size,
                width: size
              }
            ] :
            [
              styles.defaultDot,
              {
                backgroundColor,
                borderRadius: size,
                height: size,
                width: size
              }
            ]
          }
        ></Animated.View>
      );
    });
  }

  /**
   * On animated scroll view scroll end
   *
   * @param {Object} event
   */
  onScrollEnd(event) {
    // Get the current x offset
    const x = event.nativeEvent.contentOffset.x;
    // Get the index
    let index = Math.floor(x / deviceWidth);

    if (index !== this.state.index) {
      // Update state
      this.setState({ index });
    }

    // Get the current index
    let current = this.state.index;

    // Should end here
    if (current === this.state.pages.length - 1) {
      // Trigger end event for further actions
      this.state.onEndCallback();
      return;
    }
  }

  /**
   * For Debugging purposes
   *
   * @param {Event} event
   */
  onScroll(event) {
    // console.log(event.nativeEvent.contentOffset.x);
  }

  /**
   * Renders the component
   */
  render() {
    return (
      <View style={styles.container}>
        <Animated.ScrollView
          ref={ (scrollView) => { this.scrollView = scrollView } }
          horizontal={true}
          pagingEnabled={true}
          scrollEventThrottle={20}
          showsHorizontalScrollIndicator={false}
          style={styles.contentContainer}
          onScrollEndDrag={this.onScrollEnd}
          onMomentumScrollEnd={this.onScrollEnd}
          onScroll={
            Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: this.scrollX
                    }
                  }
                }
              ],
              {
                useNativeDriver: false,
                // For Debugging purposes
                listener: this.onScroll
              }
            )
          }
        >
          {this.renderContent()}
        </Animated.ScrollView>

        <View style={styles.dotsContainer}>
          {this.renderDots()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative'
  },
  contentContainer: {
    height: deviceHeight,
    position: 'relative',
    width: deviceWidth
  },
  dotsContainer: {
    alignItems: 'center',
    bottom: 100,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  },
  defaultDot: {
    backgroundColor: defaults.dotColor,
    borderRadius: defaults.dotSize,
    height: defaults.dotSize,
    marginLeft: 8,
    marginRight: 8,
    width: defaults.dotSize
  },
  activeDot: {
    backgroundColor: defaults.dotActiveColor,
    borderRadius: defaults.dotActiveSize,
    height: defaults.dotActiveSize,
    width: defaults.dotActiveSize
  }
});

export default Board;
