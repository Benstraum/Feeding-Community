import React, { Component } from 'react';
import { connect } from 'react-redux';

class DriverViewItems extends Component {
    // Renders the entire DriverViewItems on the DOM
    render() {
        return (
            <>
                <tr>
                    <td>{this.props.item.first_name} {this.props.item.last_name}</td>
                    <td>{this.props.item.phone_number}</td>
                    <td>{this.props.item.building_address1}<br /> {this.props.item.building_address2}</td> 
                    <td>{this.props.item.city}</td>                   
                    <td>{this.props.item.zip_code}</td>
                    <td>{this.props.item.menu_description}</td>                    
                    <td>{this.props.item.number_of_meals}</td>                    
                    <td>{this.props.item.meal_choice === 4 ?
                            <>
                            {this.props.item.special_request}
                            </>
                            :
                            <>
                                 
                            </>
                        }</td>
                    {/* <td>{this.props.item.program_name}</td> */}
                    <td>
                        {this.props.item.program_id == 2 ?
                            <>
                            {this.props.item.document_signed === true ?
                            <>Signed</>
                            :
                            <>Not Signed</>
                            }
                            </>
                            :
                            <>
                                N/A
                                {
                                    console.log(this.props.item)
                                }
                            </>
                        } </td>
                    {/* <td>{this.props.item.route_name}</td> */}
                </tr>
            </>
        );//end return
    }//end render
}//end class

export default connect()(DriverViewItems);