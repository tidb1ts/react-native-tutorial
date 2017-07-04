import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    WebView,
} from 'react-native';


var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6EF',
        flexDirection: 'column'
    }
});


class Web extends Component {
    render() {
        return (
            <View style={styles.container}>
                <WebView source={{uri: this.props.url}} />
            </View>
        );
    }
}


Web.propTypes = {
    url: PropTypes.string.isRequired
}


module.exports = Web;
