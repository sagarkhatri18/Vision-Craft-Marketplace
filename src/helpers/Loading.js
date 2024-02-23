import React from 'react';
import {connect} from 'react-redux';
import LoaderIcon from '../assets/img/loading_icon.gif'

class Loading extends React.Component {
    state = {  }

    render() { 
        const {loading} = this.props;

        if(!loading) return null;

        return ( 
            <div className="loader-container">
                <div className="loader">
                    <img src={LoaderIcon} alt="Loading...."/>
                </div>
            </div>
         );
    }
}

const mapStateToProps = state => ({ loading: state.Reducers.loading })

export default connect(mapStateToProps)(Loading);