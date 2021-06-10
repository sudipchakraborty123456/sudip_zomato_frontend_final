import { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Modal from 'react-modal';

import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import "../Styles/details.css";
import queryString from "query-string";
import header from "./Header";

const constants = require("../Constants");
const API_URL = constants.API_URL;



const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)',
        zIndex: '1000'
    }
};

class Details extends Component {
    constructor() {
        super();

        this.state = {
            restaurantId: '',
            restaurantName: undefined,
            cuisine: [],
            minPrice: 0,
            contact: 0,
            isMenuModalOpen: false,
            menu: [],
            totalPrice: 0,
            orderdItems: [],
            isOrderDetailsModalOpen: false,
            name: '',
            mobileNo: '',
            address: '',
            order: [],
            userDetails: undefined,
            email: '',
            orderDetails: undefined,
            restaurantLocality: '',
            restaurantCity: '',
            thumb: [],
            count: 0,
            isLogin: false,
            isSingUpModalOpen:false
        };
        this.savedetails = this.savedetails.bind(this);
        this.paymentHandeller = this.paymentHandeller.bind(this);
        this.removeitem = this.removeitem.bind(this);
        // var a = localStorage.getItem('user');
    }
    componentDidMount() {
        //debugger;
        let a = localStorage.getItem('user');
        this.setState({ userDetails: JSON.parse(a) })
        if (a) {
            this.setState({
                isLogin: true
            })
            console.log("login status changed!")
        }
        //console.log(a.email)
        //debugger;

        const qs = queryString.parse(this.props.location.search);
        const { id } = qs;

        this.setState({
            restaurantId: id
        })
        //console.log(this.state.restaurantId)
        axios.get(`${API_URL}/getAllRestaurantById/${id}`).then((result) => {
            this.setState({
                restaurantName: result.data.restaurant[0].name,
                cuisine: result.data.restaurant[0].cuisine,
                minPrice: result.data.restaurant[0].min_price,
                contact: result.data.restaurant[0].contact_number,
                restaurantCity: result.data.restaurant[0].city,
                restaurantLocality: result.data.restaurant[0].locality,
                thumb: result.data.restaurant[0].thumb

            })
            // console.log(result.data.restaurant[0].cuisine)
        }).catch((error) => { console.log(error) });
        // debugger;
        axios.get(`${API_URL}/getMenuByRestaurantId/${id}`).then((result) => {
            this.setState({
                menu: result.data.menu
            })
        }).catch((error) => { console.log(error) });

    }
    getRestaurantById() {
    }
    handelPlaceOrderClicked() {
        //debugger;
        this.setState({
            isMenuModalOpen: true
        })
    }
    placeOrderDetails() {
        if (this.state.totalPrice > 0) {
            this.setState({
                isOrderDetailsModalOpen: true
            })
        } else {
            window.alert("First add an item...")
        }

    }
    closeMenu() {
        this.setState({
            isMenuModalOpen: false
        })
    }
    closeOrderDetailsMenu() {
        this.setState({
            isOrderDetailsModalOpen: false
        })
    }
    addItem(item) {
        const itemName = item.itemName;
        const { totalPrice, orderdItems, count } = this.state;
        let itemCount = this.state[itemName] || 0;
        this.state[itemName] = itemCount + 1;
        this.setState({
            totalPrice: totalPrice + item.itemPrice,
            [itemName]: (itemCount + 1)
        })
        this.saveOrderItem(item);
    }
    saveOrderItem = (items) => {
        //  debugger
        var itemName = items.itemName;
        const itemCount = this.state[itemName]
        const { orderdItems } = this.state;
        if (orderdItems.length > 0) {
            // orderdItems.map((item,index)=>{
            //     console.log(item)
            // })
            function search(key, array) {
                //debugger
                for (let i = 0; i < array.length; i++) {
                    if (array[i].name === key) {
                        array[i].count = itemCount
                        array[i] = { name: itemName, count: itemCount }
                        return array[i]
                    }
                }
            }
            let b = search(itemName, orderdItems)
            if (b) {


            } else {
                this.state.orderdItems.push({ name: itemName, count: itemCount })
            }
            this.setState({
                orderdItems: orderdItems
            })
        } else {
            this.state.orderdItems.push({ name: itemName, count: this.state[itemName] })
        }
    }
    removeitem(item) {
        // debugger;
        // const { totalPrice, orderdItems } = this.state;
        // orderdItems.push(item.itemName);
        // this.setState({
        //     totalPrice: totalPrice - item.itemPrice,
        //     orderdItems: orderdItems
        // })

        const itemName = item.itemName;
        const { totalPrice, orderdItems, count } = this.state;
        const itemCount = this.state[itemName] || 0;
        if (this.state[itemName] > 0) {
            this.setState({
                count: count - 1,
                totalPrice: totalPrice - item.itemPrice,
                [itemName]: itemCount - 1
            })
            setTimeout(this.removeOrderdItem(item), 0);
        } else {
            window.alert("this item is not added, add the item first")
        }

    }
    removeOrderdItem = (items) => {
        // debugger
        var itemName = items.itemName;

        var itemCount = (this.state[itemName] - 1)


        const { orderdItems } = this.state;
        if (orderdItems.length > 0) {
            // orderdItems.map((item,index)=>{
            //     console.log(item)
            // })
            function search(key, array) {
                //debugger
                for (let i = 0; i < array.length; i++) {
                    if (array[i].name === key) {
                        array[i].count = itemCount
                        array[i] = { name: itemName, count: itemCount }
                        return array[i]
                    }
                }
            }
            let b = search(itemName, orderdItems)
            if (b) {


            } else {
                this.state.orderdItems.pop({ name: itemName, count: itemCount })
            }
            this.setState({
                orderdItems: orderdItems
            })
        } else {

        }
    }
    isObj = (val) => {
        return typeof val === 'object';

    }
    isDate = (val) => {
        return Object.prototype.toString.call(val) === '[object Date]';
    }

    stringifyValue(value) {
        if (this.isObj(value) && !this.isDate(value)) {
            return JSON.stringify(value);
        } else {
            return value;
        }

    }
    buildForm(details) {
        const { action, params } = details;
        const form = document.createElement('form');
        form.setAttribute("method", "post");
        form.setAttribute("action", action);

        Object.keys(params).forEach(key => {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', key);
            input.setAttribute('value', this.stringifyValue(params[key]));
            form.appendChild(input);
        });
        return form;
    }


    postTheInformation(details) {
        const form = this.buildForm(details);
        document.body.appendChild(form);
        form.submit();
        form.remove();
    }
    getCheckSum(data) {
        //debugger;
        return fetch(`${API_URL}/payment`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(data)
        }).then(result => {
            return result.json();
        }).catch(err => console.log(err))
    }

    paymentHandeller() {
        //debugger;
        // const email =this.state.userDetails.email;
        if (this.state.mobileNo && this.state.address) {
            if (this.state.mobileNo.length > 10) {
                if (this.state.address.length > 10) {
                    if (this.state.isLogin == true) {
                        // if (this.state.totalPrice == 0) {
                        //     return;
                        // }
                        let a = this.savedetails();
                        //console.log(a)
                        //let orderId = this.savedetails();
                        // this.setState({order:{
                        //     userId: (localStorage.getItem(user)),
                        //     restaurantId:id
                        // }})
                        const data = {
                            amount: this.state.totalPrice,
                            email: this.state.userDetails.email,
                            mobileNo: this.state.mobileNo,
                            orderDetails: a
                        }
                        this.getCheckSum(data).then(result => {
                            let information = {
                                action: "https://securegw-stage.paytm.in/order/process",
                                params: result
                            }
                            this.postTheInformation(information);
                        }).catch(err => console.log(err));
                    } else {
                        window.alert("Please Login First")
                        this.setState({isSingUpModalOpen:true})
                    }
                } else {
                    window.alert("Your address is too small !")
                }
            } else {
                window.alert("Please provide a valid mobile number!")
            }
        } else {
            window.alert("Please Provide Mobile No and Address first...")
        }
    }
    setValueForName(e, field) {
        //debugger;

        this.setState({
            [field]: e.target.value

        });
        //console.log(this.state.field['name']);
        // console.log(this.state.name);
        // console.log(this.state.mobileNo);
        // console.log(this.state.address);
    }

    savedetails() {
        //debugger;

        var orderDetails = {
            userId: this.state.userDetails.email,
            restaurantId: this.state.restaurantId,
            orderStatus: 'notPlaced',
            orderDetails: this.state.orderdItems,
            totalPrice: this.state.totalPrice,
            userAddress: this.state.address,
            userName: `${this.state.userDetails.firstName} ${this.state.userDetails.lastName}`,
            orderId: ""
        }
        return (orderDetails);
        // axios({
        //     method: "POST",
        //     url: `${API_URL}/placeOrder`,
        //     //headers : {"Content-Type" : "applicaton/json"},
        //     data: orderDetails
        // }).then((data)=>{
        //     //this.setState({orderDetails:orderDetails})
        //     console.log(data);
        //     return orderDetails;
        // }).catch((error)=>{console.log(error);});


    }
    componentWillMount() {
        Modal.setAppElement('body');
    }
    render() {
        //debugger;
        const { isSingUpModalOpen,thumb, restaurantCity, restaurantLocality, orderDetails, userDetails, email, name, mobileNo, address, restaurantName, cuisine, minPrice, contact, isMenuModalOpen, menu, totalPrice, isOrderDetailsModalOpen } = this.state;

        return (
            <div className="container   pt-3" style={{ "fontFamily": "Poppins", "color": "#192f60" }}>
                {
                    restaurantName
                        ?
                        <div>
                            <div className="images my-5 mx-5 " >
                                <Carousel className="carousel" dynamicHeight={false} showThumbs={false} stopOnHover={true} autoPlay={true} interval={3000} infiniteLoop={true}>
                                    {thumb.map((item, index) => {
                                        return (<div>
                                            <img src={require("../" + item).default} alt="Opps Sorry!" />
                                        </div>);
                                    })
                                    }
                                </Carousel>
                            </div>

                            <div className="resName">
                                <h1 className="resNameHeading">{restaurantName}</h1>
                                <button className="btn btn-danger float-end" onClick={() => this.handelPlaceOrderClicked()}>Place Online Order</button>
                            </div>


                            <div className="mt-5 myTabs">
                                <Tabs>
                                    <TabList>
                                        <Tab>Overview</Tab>
                                        <Tab>Contact</Tab>
                                    </TabList>

                                    <TabPanel>
                                        <div className="about">About This Page</div>
                                        <div className="cuisine">Cuisine</div >
                                        <div className="cuisines">
                                            {
                                                cuisine.map((item, index) => {
                                                    return `${item.name},`
                                                })
                                            }
                                        </div>
                                        <div className="cuisine mt-3">Average Cost</div>
                                        <span>₹ {minPrice} for two people (approx.)</span>
                                    </TabPanel>
                                    <TabPanel>
                                        <div className="container">
                                            <div className="cuisines my-3">
                                                Phone Number
                                            <div className="text-danger">
                                                    {contact}
                                                </div>
                                            </div>
                                            <div className="cuisine mt-5">{restaurantName}</div>
                                            <div className="text-muted">{restaurantLocality}, {restaurantCity}</div>
                                        </div>
                                    </TabPanel>
                                </Tabs>
                            </div>
                            <Modal isOpen={isMenuModalOpen} style={customStyles}>
                                <h3 className='menuHeading'>{restaurantName}</h3>
                                <button onClick={() => this.closeMenu()} className="btn btn-light closeBtn">&times;</button>
                                <ul className="menu">

                                    {
                                        menu.map((item, index) => {
                                            return (
                                                <li key={index}>
                                                    <div className="row no-gutters  menuItem">
                                                        <div className="col-8" >
                                                            {
                                                                item.isVeg ?
                                                                    <div className="text-success" style={{
                                                                        'width': '16px',
                                                                        'height': '16px',
                                                                        'padding': '4px',
                                                                        'border': 'solid 1px #048002',
                                                                        ' backgroundColor': '#ffffff'
                                                                    }}><div style={{
                                                                        'width': '6px',
                                                                        'height': '6px',
                                                                        ' borderRadius': '4px',
                                                                        'border': 'solid 1px #048002',
                                                                        'backgroundColor': '#048002',
                                                                    }}></div></div>
                                                                    :
                                                                    <div className="text-danger" style={{
                                                                        'width': '16px',
                                                                        'height': '16px',
                                                                        'padding': '4px',
                                                                        'border': 'solid 1px red',
                                                                        ' backgroundColor': '#ffffff'
                                                                    }}><div style={{
                                                                        'width': '6px',
                                                                        'height': '6px',
                                                                        ' borderRadius': '4px',
                                                                        'border': 'solid 1px red',
                                                                        'backgroundColor': 'red',
                                                                    }}></div></div>
                                                            }
                                                            <div className="itemName">{item.itemName}</div>
                                                            <div className="itemPrice">{item.itemPrice}</div>
                                                            <div className="itemDec text-muted">{item.itemDescription}</div>
                                                        </div>
                                                        <span className="col-4 orderItem">
                                                            <span className="countItem">{this.state[item.itemName]}</span>
                                                            <span className=" orderItemCount">
                                                                <button className="btn btn-light addButton" onClick={() => this.addItem(item)}>+</button>
                                                                <button className="btn btn-light addButton" onClick={() => this.removeitem(item)}>-</button>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                                <div className="subTotal">
                                    <div className="price" >
                                        Subtotal &#8377; {totalPrice}
                                    </div>
                                    <button className="btn btn-danger float-end" onClick={() => this.placeOrderDetails()}>Place Order</button>
                                </div>
                            </Modal>

                            <Modal isOpen={isOrderDetailsModalOpen} style={customStyles}>
                                <div className="container">
                                    <div >
                                        <h3 className="heading2">{restaurantName}</h3>
                                        <button className=" btn btn-light" onClick={() => this.closeOrderDetailsMenu()} className="btn btn-light closeBtn">&times;</button>
                                    </div>
                                    <div >
                                        <div className="subHading">Name</div>
                                        <input className="inputField" type="text" placeholder="Enter your name" onChange={(e) => this.setValueForName(e, 'name')} />
                                        <div className="subHading" required min="10">Mobile Number</div>
                                        <input type="number" className="inputField" placeholder="Enter mobile number" onChange={(e) => this.setValueForName(e, 'mobileNo')} />
                                        <div className="subHading" required>Address</div>
                                        <input type="text" className="inputField" placeholder="Enter your address" onChange={(e) => this.setValueForName(e, 'address')} />
                                    </div>
                                    <br />
                                    <button className="btn btn-danger float-end" type="submit" value="submit" onClick={this.paymentHandeller}>Pay Now</button>

                                </div>
                            </Modal>
                            <Modal isOpen={isSingUpModalOpen} style={customStyles}>
                            <h3>User Singup</h3>
                            <form>
                                {
                                    singUpError ? <div className="alert alert-danger">{singUpError}</div> : null
                                }
                                <label className="form-label">First Name:</label>
                                <input type="text" value={firstName} className="form-control" onChange={(event) => header.handleChange(event, 'firstName')} />
                                <br />
                                <br />
                                <label className="form-label">Last Name:</label>
                                <input type="text" value={lastName} className="form-control" onChange={(event) => header.handleChange(event, 'lastName')} />

                                <br />
                                <br />
                                <label className="form-label">email:</label>
                                <input type="text" value={username} placeholder="Username" className="form-control" onChange={(event) => header.handleChange(event, 'username')} />
                                <br />
                                <label className="form-label">Password:</label>
                                <input type="password" value={password} className="form-control" onChange={(event) => header.handleChange(event, 'password')} />
                                <br />
                                <br />
                                <FacebookLogin
                                    appId="4356797374331461"
                                    autoLoad={false}
                                    fields="name,email,picture"
                                    onClick={header.componentClicked}
                                    callback={header.responseFacebookSuingUp}
                                    icon="bi bi-facebook p-2 m-2"
                                    cssClass="fb"
                                />
                                <br />
                                <Googlelogin
                                    clientId="946053029267-3osdvlorecoptosi14vh65g4k982ncvi.apps.googleusercontent.com"
                                    buttonText="Continue with Google"
                                    onSuccess={header.responseSuccessGoogle}
                                    onFailure={header.responseFailureGoogle}
                                    cookiePolicy={'single_host_origin'}
                                    className="google"
                                />
                                <br />
                                <br />
                                <input type="button" className="btn btn-primary" onClick={header.handleSingUp} value="Sing Up" />
                                <input type="button" className="btn" onClick={header.resetSingUpForm} value="Cancel" />
                            </form>
                        </Modal>
                        </div>
    :
    <div className="text-dark m-5 p-5 fs-6 text-center"> Loading... {console.warn("Restaurant Id not found !")}</div>
                                }
            </div>
        );
    }
}

export default Details;