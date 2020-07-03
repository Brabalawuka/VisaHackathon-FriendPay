import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import './Cart.css';

class Cart extends Component {

  state = { redirect: null };

  componentDidMount() {
    window.onPaymentRequestSuccess(response => {
      this.setState({ redirect: `/status/${JSON.parse(response).requestId}` })
    })
  }

  getTotalPrice = () => {
    let total = 0;
    this.props.items.forEach(item => {
      total += item.price;
    });
    return total;
  }

  handleFriendPay = () => {
    window.passPaymentInfo("SGD", this.getTotalPrice(), "6SCAZHGYCINAKCFFNTH121fPTuolFh9zHICbhkF1L0Sji0ewc", "8EI6ILKH6WIK3SWAAPHK13I4CgnApbkyST9pBM7W9kK2-F3mo");
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className="container">
        <h1>Shopping Cart</h1>
        <Table responsive className="cart-table cart-section">
          <thead>
            <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.items.map(item => {
                return (
                  <tr key={item.id}>
                    <td>
                      <img src={item.img} alt={item.title} />
                      <div className="item-title">
                        <h4>{item.title}</h4>
                        <p><em>{item.brand}</em></p>
                      </div>
                    </td>
                    <td><h4 className="number-text">1</h4></td>
                    <td><h4 className="number-text">${item.price}</h4></td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
        <div id="paymentSection" className="cart-section">
          <div style={{"paddingBottom": "2rem"}}>
            <h4>Total:</h4>
            <h4 className="number-text" style={{"paddingLeft": "4rem"}}> ${this.getTotalPrice()}</h4>
          </div>
          <Button id="friendPayButton" onClick={() => {
            this.handleFriendPay()
          }}>Checkout with <strong>FriendPay</strong></Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    items: state.items
  }
}

export default connect(mapStateToProps)(Cart);