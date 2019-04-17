import React, { Component } from "react";
import { withNavigation } from "react-navigation";
import { BackHandler } from "react-native";

class HandleBack extends Component {
    constructor(props) {
        super(props);

        this.didFocus = props.navigation.addListener("didFocus", payload =>
                BackHandler.addEventListener("hardwareBackPress", this.onBack),
            );
    }

    componentDidMount() {
        this.willBlur = this.props.navigation.addListener("willBlur", payload =>
                BackHandler.removeEventListener("hardwareBackPress", this.onBack),
            );
    }

    onBack = () => {
        if (this.props.onBack) {
            return this.props.onBack();
        } else {
            if (this.props.popToTop) {
                this.props.navigation.popToTop();
            } else  if(this.props.goBack) {
                this.props.navigation.goBack(this.props.route || null);
            } else if (this.props.closeDrawer) {
                this.props.navigation.closeDrawer();
            } else if (this.props.navigate) {
                this.props.navigation.navigate(this.props.route, this.props.param);
            }

            return true;
        }
    };

    componentWillUnmount() {
        this.didFocus.remove();
        this.willBlur.remove();
        BackHandler.removeEventListener("hardwareBackPress", this.onBack);
    }

    render() {
        return this.props.children;
    }
}

export default withNavigation(HandleBack);
