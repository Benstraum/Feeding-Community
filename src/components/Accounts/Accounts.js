import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Accounts.scss';
import AccountsItem from '../AccountsItem/AccountsItem';
import SearchBar from '../SearchBar/SearchBar';
// import Moment from 'react-moment';

class Accounts extends Component {
  // Renders the entire Accounts on the DOM
  // dispatch call GET_ALL_DEPENDENTS and UPDATE_DEPENDENT, DISABLE_DEPENDENT potentially

  state = {
    first_name: '',
    last_name: '',
    email_address: '',
    date_of_birth: '',
    annual_income: '',
    phone_number: '',
    building_address1: '',
    building_address2: '',
    zip_code: '',
    county_id: '',
    city: '',
    special_request: '',
    dietary_restrictions: '',
  }

  componentDidMount() {
    console.log('component did mount')
    //dispatch call to GET all dependents
    this.props.dispatch({ type: 'GET_ALL_DEPENDENTS' });
    this.props.dispatch({type: 'GET_COUNTIES'});
    this.props.dispatch({type: 'GET_ORGS'});
    this.props.dispatch({type: 'GET_MENU'});
    this.props.dispatch({type: 'GET_PROGRAMS'});
  }//end componentDidMount

  render() {
    console.log(this.props.reduxState.allDependents)
    return (
      <div className="Accounts">
        <div className="accountItems">
          <h2>ACCOUNTS</h2>
          <p>List of all accounts, you can edit within any row.</p>
        </div>
        <div>
          <SearchBar referralQuery={this.props.reduxState.organizations} 
          dependents={this.props.reduxState.allDependents}
          programQuery={this.props.reduxState.programs} 
          dependents={this.props.reduxState.allDependents}>
          </SearchBar>
        </div>
        <div className="accountItems acctTable">
          <table>
            <caption>Accounts</caption>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Date of Birth</th>
                <th>Address</th>
                <th>Zip Code</th>
                <th>County</th>
                <th>City</th>
                <th>Special Requests</th>
                <th>Meal Type</th>
                <th>Dietary Restrictions</th>
                <th>Referral Organization</th>
                <th>Qualified Program</th>
                <th>Signed</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {/* this table row and data below will eventually come from a .map of reduxState */}
              <tr>
                {/* name td will return a concatenated string of first and last name */}
                <td>Mohamed Mohamed</td>
                <td>612-867-5309</td>
                <td>01/01/1960</td>
                {/* address td will be a concatenated string of building_address 1 and 2 */}
                <td>4321 Afro Deli Lane, Apt 2</td>
                <td>55413</td>
                <td>Hennepin</td>
                <td>Minneapolis</td>
                <td>No meat</td>
                <td>Veggie</td>
                <td></td>
                <td>MN Senior Center</td>
                <td>Meals On Wheels</td>
                <td>Yes</td>
                {/* this will conditionally render all information to inputs */}
                <td><button>Edit</button></td>
              </tr>
              {this.props.reduxState.allDependents.map((item) => (
                <AccountsItem key={item.id} item={item}/>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );//end return
  }//end render
}//end class

//will need a map reduxState for dependents
const mapReduxStateToProps = (reduxState) => ({ reduxState });
export default connect(mapReduxStateToProps)(Accounts);