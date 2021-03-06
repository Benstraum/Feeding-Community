import React, { Component } from 'react';
import { connect } from 'react-redux';
import "../IntakeForm/IntakeForm.scss";


class IntakeForm extends Component {

    state = {
        first_name: '',
        last_name: '',
        phone_number: '',
        building_address1: '',
        building_address2: '',
        city: '',
        zip_code: '',
        county_id: 0,
        date_of_birth: '',
        special_request: '',
        dietary_restrictions: '',
        number_of_meals: 1,
        route_id: 1,
        meal_choice: 1,
        referral_id: 1,
        program_id: 1,
        special_request_toggle: false
        
    }

    componentDidMount = () => {
        this.getCounty();
        this.getOrg();
        this.getPrograms();
        this.getRoutes();
    }

    getCounty = () => {
        this.props.dispatch({
            type: 'GET_COUNTIES',
        })
    }

    getOrg = () => {
        this.props.dispatch({
            type: 'GET_ORGS',
        })
    }

    getPrograms = () => {
        this.props.dispatch({
            type: 'GET_PROGRAMS',
        })
    }

    getRoutes = () => {
        this.props.dispatch({
            type: 'GET_ROUTES',
        })
    }

    createDependent = (event) => {
        event.preventDefault();
        console.log('this.state', this.state)
        this.props.dispatch({ type: 'POST_NEW_DEPENDENT', payload: this.state });
        this.setState({
            first_name: '',
            last_name: '',
            phone_number: '',
            building_address1: '',
            building_address2: '',
            city: '',
            zip_code: '',
            county_id: 0,
            date_of_birth: '',
            special_request: '',
            dietary_restrictions: '',
            route_id: 1,
            meal_choice: 1,
            referral_id: 1,
            program_id: 1
        })

    }

    handleInputs = (event, typeOf) => {
        this.setState({
            [typeOf]: event.target.value
        })

        if (typeOf === 'program_id'){
            if(event.target.value === "1"){
                this.setState({
                    number_of_meals: this.props.programs[0].default_no_meals
                })
            }
            else if(event.target.value === "2"){
                this.setState({
                    number_of_meals: this.props.programs[1].default_no_meals
                })
            }
            
        }
    }


    render() {
        return (
            <div className="intakeForm">
                <h2>Intake Form</h2>
                {/* <p>Enter client information form</p> */}
                <div>
                    <form className="formItem" onSubmit={this.createDependent}>
                        <p>Please enter client information below</p>
                        <label></label>
                        <input
                            required
                            type="text"
                            placeholder="First Name"
                            value={this.state.first_name}
                            onChange={(event) => this.handleInputs(event, "first_name")}
                        />
                        <br />
                        <label></label>
                        <input
                            required
                            type="text"
                            value={this.state.last_name}
                            placeholder="Last Name"
                            onChange={(event) => this.handleInputs(event, "last_name")}
                        />
                        <br />
                        <label></label>
                        <input
                            required
                            type="text"
                            value={this.state.phone_number}
                            placeholder="Phone Number"
                            onChange={(event) => this.handleInputs(event, "phone_number")}
                        />
                        <br />
                        <label></label>
                        <input
                            required
                            type="text"
                            value={this.state.building_address1}
                            placeholder="Street address"
                            onChange={(event) => this.handleInputs(event, "building_address1")}
                        />
                        <br />
                        <label></label>
                        <input
                            type="text"
                            value={this.state.building_address2}
                            placeholder="House / Apt # / Business"
                            onChange={(event) => this.handleInputs(event, "building_address2")}
                        />
                        <br />
                        <label></label>
                        <input
                            required
                            type="text"
                            value={this.state.city}
                            placeholder="City"
                            onChange={(event) => this.handleInputs(event, "city")}
                        />
                        <br />
                        <label></label>
                        <input
                            required
                            type="number"
                            value={this.state.zip_code}
                            placeholder="Zip Code"
                            onChange={(event) => this.handleInputs(event, "zip_code")}
                        />
                        <br />
                        <label></label>
                        <select
                            required
                            value={this.state.county_id}
                            placeholder="select county"
                            type="dropdown"
                            onChange={(event) =>
                                this.handleInputs(event, "county_id")
                            }>
                            <option value="0" disabled>Select County</option>
                            {this.props.counties.map((item) => ( 
                                <option key={item.id} value={item.id}>{item.county_name}</option>
                            ))}
                        </select>
                        <br />
                        <label htmlFor="Date of Birth">Date of Birth:</label>
                        <input
                            required
                            type="date"
                            value={this.state.date_of_birth}
                            onChange={(event) => this.handleInputs(event, "date_of_birth")}
                        />
                        <br />
                        <select
                            type="dropdown"
                            value={this.state.meal_choice}
                            placeholder="Select Meat"
                            onChange={(event) => this.handleInputs(event, "meal_choice")
                            }>
                            <option disabled value> -- Select Food Option --</option>
                            <option value="1">Chicken or Beef</option>
                            <option value="2">Fish</option>
                            <option value="3">Veggie Only</option>
                            <option value="4">Special Request</option>

                        </select>
                        {this.state.meal_choice === '4' &&
                        <input
                        required
                        type="text"
                        value={this.state.special_request}
                        placeholder="Special Requests (ex. Extra Beef)"
                        onChange={(event) => this.handleInputs(event, "special_request")}
                    />

                }
                        <label></label>
                        <br />
                        <label></label>
                        <input
                            required
                            type="text"
                            value={this.state.dietary_restrictions}
                            placeholder="Dietary Restrictions (ex. gluten free)"
                            onChange={(event) => this.handleInputs(event, "dietary_restrictions")}
                        />
                        <br />
                        <p>Referral Organization:</p>
                        <select
                            type="dropdown"
                            value={this.state.referral_id}
                            onChange={(event) =>
                                this.handleInputs(event, "referral_id")
                            }>
                            <option disabled value="">-- Select Referral Organiztation --</option>
                            {this.props.organizations.map((item) => (
                                <option key={item.id} value={item.id}>{item.referral_name}</option>
                            ))}
                        </select>
                        <br />
                        <p>Program:
                        </p>
                        <select
                            type="dropdown"
                            value={this.state.program_id}
                            onChange={(event) =>
                                this.handleInputs(event, "program_id")
                            }>
                                <option disabled value> -- Select Program --</option>
                            {this.props.programs.map((item, i) => (
                                <option key={item.id} value={item.id}>{item.program_name}</option>
                            ))}
                        </select>
                        <br />
                        <p>Route Assignment:
                        </p>
                        <select
                            type="dropdown"
                            value={this.state.route_id}
                            onChange={(event) =>
                                this.handleInputs(event, "route_id")
                            }>
                            {this.props.routes.map((item) => (
                                <option key={item.id} value={item.id}>{item.route_name}</option>
                            ))}
                        </select>
                        <br />
                        <button className="submit" onClick={this.createDependent}>Submit</button>

                    </form>
                </div>
            
            </div>
        


        )
    }
}

const mapStateToProps = (reduxState) => ({
    counties: reduxState.counties,
    organizations: reduxState.organizations,
    programs: reduxState.programs,
    routes: reduxState.driverRoutes
});


export default connect(mapStateToProps)(IntakeForm);