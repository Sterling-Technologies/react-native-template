// dependencies
import React, { Component } from 'react';
import { View } from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';

// styles
import baseStyle from '@assets/styles/base';

const styles = { ...baseStyle };

/**
 * Components Navigation Tabs IOS Component
 */
class IOS extends Component {
    /**
    * Components Navigation Tabs IOS Component Constructor
    */
    constructor(props) {
        super(props);

        // states
        this.state = {
        routes: [],
        selectedIndex: 0,
        tabTitles: [],
        };

        // bind methods
        this._handleIndexSelect = this._handleIndexSelect.bind(this);
        this._renderRoutes = this._renderRoutes.bind(this);
        this._renderTabTitles = this._renderTabTitles.bind(this);
    }

    /**
    * Will run once the component is loaded.
    */
    componentDidMount() {
        // do we have routes?
        if (this.props.routes && this.props.routes.length > 0) {
            this.setState({ routes: this.props.routes }, () => {
                // render routes
                this._renderRoutes();

                // render the tab names
                this._renderTabTitles();
            });
        }
    }

    render() {
        // state objects
        let { routes, selectedIndex, tabTitles } = this.state;

        return (
            <View style={[styles.standardBackground]}>
                <SegmentedControlTab
                borderRadius={25}
                selectedIndex={selectedIndex}
                onTabPress={this._handleIndexSelect}
                tabStyle={{backgroundColor: 'transparent'}}
                tabsContainerStyle={{height: 44, marginHorizontal: 16, marginVertical: 16}}
                tabTextStyle={styles.smallestText}
                values={tabTitles}
                />
            </View>
        );
    }

    /**
    * Handles on selecting the tab to show.
    *
    * @param {Integer} index
    */
    _handleIndexSelect(index) {
        // state objects
        let { routes } = this.state;

        this.setState({
            selectedIndex: index,
        }, () => {
            // render the route
            this._renderRoutes();
        });
    }

    /**
    * Renders the routes.
    */
    _renderRoutes() {
        // state objects
        let { routes } = this.state;

        if (!routes || routes.length < 1) {
            return false;
        }

        // render a specific route when selectedIndex matches the routes' index
        routes.map((value, index) => {
            if (this.state.selectedIndex === index) {
                this.props.navigation.navigate(value.routeName);
            }
        });
    }

    /**
    * Renders the titles of the tabs.
    */
    _renderTabTitles() {
        let tabTitles = [];

        // push title elements to tabTitles array
        this.state.routes.map((value, index) => {
            tabTitles.push(value.title);
        });

        // set state to tabTitles
        this.setState({ tabTitles });
    }
}

export default IOS;
