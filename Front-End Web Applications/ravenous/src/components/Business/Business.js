import React from 'react'
import './Business.css'

class Business extends React.Component {
    render() {
        return (
            <div class="Business">
                <div class="image-container">
                    <img src={this.props.imageSrc} alt=''/>
                </div>
                <h2>{this.props.name}</h2>
                <div class="Business-information">
                    <div class="Business-address">
                    <p>{this.props.address}</p>
                    <p>{this.props.city}</p>
                    <p>{this.props.state} {this.props.zipCode}</p>
                    </div>
                    <div class="Business-reviews">
                    <h3>{this.props.category}</h3>
                    <h3 class="rating">{this.props.rating} stars</h3>
                    <p>{this.props.reviewCount} reviews</p>
                    </div>
                </div>
            </div>
        );
    }
};

export default Business;