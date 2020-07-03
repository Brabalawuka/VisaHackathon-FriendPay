import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import { connect } from 'react-redux';
import { MdCheckCircle, MdCancel, MdQueryBuilder } from 'react-icons/md';
import './Status.css';

class Status extends Component {

  state = {
    transactionStatus: "PENDING"
  }

  componentDidMount() {
    this.timer = setInterval(() =>{
      window.getPaymentStatus(this.props.match.params.id, this.handlePaymentSuccess)
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  handlePaymentSuccess = response => {
    const parsed_res = JSON.parse(response);
    switch(parsed_res.transactionStatus) {
      case "Pending":
        this.setState({ transactionStatus: "PENDING" });
        break;
      case "Success":
        this.setState({ transactionStatus: "SUCCESS" });
        break;
      case "Rejected":
        this.setState({ transactionStatus: "REJECT" });
        break;
      case "Expired":
        this.setState({ transactionStatus: "EXPIRED" });
        break;
      default:
        this.setState({ transactionStatus: "PENDING" });
        return;
    }
  }

  toggleTransactionIcon() {
    switch(this.state.transactionStatus) {
      case "PENDING":
        return <h1 className="display-3 text-secondary"><MdCheckCircle /></h1>
      case "SUCCESS":
        return <h1 className="display-3 text-success"><MdCheckCircle /></h1>
      case "REJECT":
        return <h1 className="display-3 text-danger"><MdCancel /></h1>
      case "EXPIRED":
        return <h1 className="display-3 text-danger"><MdQueryBuilder /></h1>
      default:
        return <h1 className="display-3 text-secondary"><MdCheckCircle /></h1>
    }
  }

  toggleTransactionMessage() {
    switch(this.state.transactionStatus) {
      case "PENDING":
        return "Pending payment...";
      case "SUCCESS":
        return "Payment successful!";
      case "REJECT":
        return "Payment rejected";
      case "EXPIRED":
        return "Request timed out";
      default:
        return "Pending payment";
    }
  }
  
  getTotalPrice = () => {
    let total = 0;
    this.props.items.forEach(item => {
      total += item.price;
    });
    return total;
  }

  render() {
    return (
      <div className="container">
        <h1 style={{marginBottom:"2rem"}}>Thanks for using FriendPay!</h1>
        <p className="lead">This page automatically updates when payment has been completed.</p>
        <div style={{textAlign:"center"}}>
          <div id="statusSection">
            <div className="status-bar">
              <h1 className="display-3 text-success"><MdCheckCircle /></h1>
              <span className="status-text">Request sent</span>
            </div>
            <svg className="status-bar">
              <rect y="10" width="100%" height="5" fill="#6c757d" />
            </svg>
            <div className="status-bar">
              {this.toggleTransactionIcon()}
              <span className="status-text">{this.toggleTransactionMessage()}</span>
            </div>
          </div>
        </div>
        <h3>Order Summary</h3>
        <Table responsive>
          <tbody>
            {
              this.props.items.map(item => {
                return (
                  <tr key={item.id}>
                    <td><em>{item.brand} </em>{item.title}</td>
                    <td className="number-text">x 1</td>
                    <td className="number-text">${item.price}</td>
                  </tr>
                )
              })
            }
            <tr>
              <td />
              <td><strong>Total:</strong></td>
              <td className="number-text">
                <strong>${this.getTotalPrice()}</strong>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    items: state.items
  }
}

export default connect(mapStateToProps)(Status);