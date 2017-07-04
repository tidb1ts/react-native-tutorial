import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TextInput,
    TouchableHighlight
} from 'react-native';
import api from '../Utils/api';
import Badge from './Badge';
import Separator from './Helpers/Separator';


var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    buttonText: {
        fontSize: 18,
        color: 'white'
    },
    button: {
        height: 60,
        backgroundColor: '#48BBEC',
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInput: {
        height: 60,
        padding: 10,
        fontSize: 18,
        color: '#111',
        flex: 10,
    },
    rowContainer: {
        padding: 10
    },
    footerContainer: {
        backgroundColor: '#E3E3E3',
        alignItems: 'center',
        flexDirection: 'row',
    }
});


class Notes extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
        this.state = {
            dataSource: this.ds.cloneWithRows(this.props.notes),
            note: '',
            error: ''
        }
    }

    handleChange(event) {
        this.setState({
            note: event.nativeEvent.text
        });
    }

    handleSubmit() {
        var note = this.state.note;
        this.setState({
            note: ''
        });
        // save the new note to firebase
        api.addNote(this.props.userInfo.login, note)
            .then((data) => {
                //once saved, get all the notes back from firebase
                api.getNotes(this.props.userInfo.login)
                    .then((data) => {
                        this.setState({
                            dataSource: this.ds.cloneWithRows(data)
                        })
                    })
            }).catch((error) => {
                console.log('******* Request Failed *******');
                console.log(error);
                this.setState({error: error});
            })
    }

    renderRow(rowData) {
        return (
            <View>
                <View style={styles.rowContainer}>
                    <Text> {rowData} </Text>
                </View>
                <Separator />
            </View>
        );
    }

    footer() {
        return (
            <View style={styles.footerContainer}>
                <TextInput
                    style={styles.searchInput}
                    value={this.state.note}
                    onChange={this.handleChange.bind(this)}
                    placeholder="New Note" />
                <TouchableHighlight
                    style={styles.button}
                    onPress={this.handleSubmit.bind(this)}
                    underlayColor='#88D4F5' >
                    <Text style={styles.buttonText}> SUBMIT </Text>
                </TouchableHighlight>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    renderHeader={() => <Badge userInfo={this.props.userInfo} /> }>
                </ListView>
                {this.footer()}
            </View>
        );
    }
}


Notes.propTypes = {
    userInfo: PropTypes.object.isRequired,
    notes: PropTypes.object.isRequired
}


module.exports = Notes;
