import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import '../Styles/header.css';
import FacebookLogin from "react-facebook-login";
import Googlelogin from "react-google-login";


const constants = require("../Constants");
const API_URL = constants.API_URL;



const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '0',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)',
        width: '350px',
        zIndex:"100"
    }
};
const customStyles1 = {
    content: {
        top: '5%',
        left: '70%',
        right: '0',
        bottom: '0',
        marginRight: '0',
        // transform: 'translate(-50%, -50%)',
        boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.16)',
        width: '350px',
        overflow: 'scroll',
        'max-height': '500px',
        backgroundColor:'white'


    }
};

class Header extends Component {

    constructor() {
        super();
        this.state = {
            background: 'coloured',
            isLoginModalOpen: false,
            isSingUpModalOpen: false,
            username: '',
            password: '',
            firstName: '',
            lastName: "",
            user: undefined,
            isLoggedIn: false,
            loginError: undefined,
            singUpError: undefined,
            isUserDashBordOpen: false,
            orderDetails: [],
            isMyProfileOpen: false

        };
        this.userDastbord = this.userDastbord.bind(this);
        this.showOrderDetails = this.showOrderDetails.bind(this);
        this.responseSuccessGoogle = this.responseSuccessGoogle.bind(this);
        this.responseFacebookLogin = this.responseFacebookLogin.bind(this);
        this.responseSuccessGooglelogin = this.responseSuccessGooglelogin.bind(this);
    }

    componentDidMount() {
        const initialPath = this.props.history.location.pathname;
        this.setHeaderStyle(initialPath)

        this.props.history.listen((location, action) => {
            this.setHeaderStyle(location.pathname)

        });

        const isLoggedIn = localStorage.getItem("isLoggedIn");
        let user = localStorage.getItem("user");
        if (user) {
            user = JSON.parse(user);
        }
        this.setState({
            user: user,
            isLoggedIn: isLoggedIn
        });
    }
    setHeaderStyle = (path) => {
        let bg = '';
        if (path === '/' || path === '/home') {
            bg = 'transparent';
        } else {
            bg = 'coloured';
        }
        this.setState({
            background: bg
        });
    }

    handleChange = (event, field) => {
        this.setState({
            [field]: event.target.value,
            loginError: undefined
        });
    }

    handleLoginButtonClick = () => {
        this.setState({
            isLoginModalOpen: true,
            isSingUpModalOpen: false
        });
    }
    handelSingUpButtonClicked = () => {
        this.setState({
            isSingUpModalOpen: true,
            isLoginModalOpen: false
        });
    }
    handleLogin = () => {
        // call the API to login the user
       // debugger
        const { username, password } = this.state;
        if(username.length==0){
            window.alert("Enter email first!")
            return;
        }
        if(password.length==0){
            window.alert("Enter password first!")
            return;
        }
        const obj = {
            email: username,
            password: password
        }
        axios({
            method: 'POST',
            url: `${API_URL}/login`,
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            if(result.data.data=="This email is not exist"){
                this.setState({
                    loginError: 'This email is not exist, You have to signUp first !!'
                });
                return;
            }else{
            localStorage.setItem("user", JSON.stringify(result.data.user[0]));
            localStorage.setItem("isLoggedIn", true);
            this.setState({
                user: result.data.user[0],
                isLoggedIn: true,
                loginError: undefined
            });
            this.resetLoginForm();
        }
        }).catch(error => {
            this.setState({
                loginError: 'Password is wrong !!'
            });
            console.log(error);
        });
    }

    logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        this.setState({
            user: undefined,
            isLoggedIn: false
        });
    }

    resetLoginForm = () => {
        this.setState({
            isLoginModalOpen: false,
            username: '',
            password: '',
            loginError: undefined
        });
    }

    handleSingUp = () => {
        const { username, password, firstName, lastName } = this.state;
        if(username.length==0 ){
            window.alert("Enter email first!")
            return;
        }
        if(password.length==0){
            window.alert("Enter password first!");
            return;
        }
        if(firstName.length==0){
            window.alert("Enter first name first!");
            return;
        }
        if(lastName.length==0){
            window.alert("Enter last name first!");
            return;
        }
        const obj = {
            email: username,
            password: password,
            firstName: firstName,
            lastName: lastName
        }
        axios({
            method: 'POST',
            url: `${API_URL}/userSignUp`,
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            //debugger
            if(result.data.data=="Use another email"){
                window.alert("This email is already used, try with another email")
                return;
            }
            localStorage.setItem("user", JSON.stringify(result.data.user));
            localStorage.setItem("isLoggedIn", true);
            this.setState({
                user: result.data.user,
                isLoggedIn: true,
                loginError: undefined,
                singUpError: undefined
            });
            this.resetSingUpForm();
        }).catch(error => {
            this.setState({
                singUpError: 'Error in SingUp !!'
            });
            console.log(error);
        });
    }

    resetSingUpForm = () => {
        this.setState({
            isSingUpModalOpen: false,
            username: '',
            password: '',
            firstName: "",
            lastName: "",
            singUpError: undefined
        });
    }
    logoClick() {
        this.props.history.push("/");
    }

    componentClicked() {
        console.log("Clicked!")
    }
    responseFacebookSuingUp = (response) => {
        //console.log(response)
        if (response.status !== 'unknown') {
            let name = response.name;
            name = response.name.split(" ");
            let fName = name[0];
            let lName = name[1];
            let email = response.email;
            this.setState({
                username: email,
                password: response.id,
                firstName: fName,
                lastName: lName
            })
            this.handleSingUp();
        }
    }
    responseFacebookLogin(response) {
        //console.log(response)
        this.setState({
            username: response.email,
            password: response.id
        })
        this.handleLogin();
    }
    responseFailureGoogle(response) {
        console.log(response)
    }
    responseSuccessGoogle(response) {
        //debugger
        let fName = response.profileObj.givenName;
        let lName = response.profileObj.familyName;
        let email = response.profileObj.email;
        this.setState({
            username: email,
            password: response.profileObj.googleId,
            firstName: fName,
            lastName: lName
        })
        this.handleSingUp();
    }
    responseSuccessGooglelogin(response) {
        console.log(response)

        this.setState({
            username: response.profileObj.email,
            password: response.profileObj.googleId
        })
        this.handleLogin();
    }
    userDastbord() {
        this.setState({
            isUserDashBordOpen: true
        })
        const email = this.state.user.email;
        axios.get(`${API_URL}/getOrder/${email}`).then((result) => {
            this.setState({
                orderDetails: result.data.data
            })
            // console.log(this.state.orderDetails)
        }).catch((error) => { console.log(error) });
    }

    showOrderDetails = () => {
        //debugger;
        const { orderDetails } = this.state;
        if (orderDetails.length == 0) {
            return <li>No Order Found!</li>;
        }
        return (
            <ul className="orderDetailssBox">
                {
                    orderDetails.map((item, index) => {
                        return (
                            <li style={{
                                'style': 'none', 'box-shadow': '0 3px 6px 0 rgba(0, 0, 0, 0.16)',
                                'background-color': '#ffffff', 'margin-bottom': '10px'
                            }}>
                                <div className="od">
                                    Order Id : {item.orderId}
                                    <li />
                                    Restaurant Id : {item.restaurantId}
                                    <div>
                                        {
                                            item.orderStatus == 'placed'
                                                ?
                                                <div className='' style={{ 'color': 'rgb(0, 230, 64)' }}>Order Status : {item.orderStatus}</div>
                                                :
                                                <div className='' style={{ 'color': 'red' }}>Order Status : {item.orderStatus}</div>
                                        }
                                        {
                                            item.orderDetails.map((item, index) => {
                                                if (item.count > 0) {
                                                    return (<div>{item.name}:{item.count}</div>);
                                                }
                                            })
                                        }

                                    </div>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        );
    }
    closeOrderDetails() {
        this.setState({
            isUserDashBordOpen: false
        })
    }
    myProfile(){
        this.setState({
            isMyProfileOpen: true
        })
    }
    optionChanged(e){
        //debugger;
        if(e.target.value=="My Orders"){
            this.userDastbord();
        }
        if(e.target.value=="My Profile"){
            this.myProfile();
        }
    }
    closeMyProfile(){
        this.setState({
            isMyProfileOpen: false
        })
    }
    render() {
        const { isMyProfileOpen,isUserDashBordOpen, background, isLoginModalOpen, username, password, isLoggedIn, user, loginError, isSingUpModalOpen, firstName, lastName, singUpError } = this.state;
        return (
            <div className="">
                <div className="float-end">
                    <div className="header  " style={{ 'background': background === 'transparent' ? 'transparent' : '#eb2929' }}>
                        {
                            background === "coloured"
                                ?
                                <div className="header-logo" onClick={() => this.logoClick()}>
                                    e!
                    </div>
                                :
                                <div></div>
                        }
                        <div className="   mr-30 loginButton " >
                            {
                                isLoggedIn
                                    ?
                                    <div style={{}}>
                                        <span className="text-white m-4"  >
                                            {/*  */}
                                        {user.firstName} <select onChange={(e)=>this.optionChanged(e)} style={{width:'18px',backgroundColor:"transparent",border:'none'}}>
                                                <option desable selected></option>
                                                <option>My Profile    </option>
                                                <option >My Orders   </option>
                                            </select></span >
                                        <button className="btn btn-outline-light" onClick={this.logout}>Logout</button>
                                        <Modal isOpen={isMyProfileOpen} style={customStyles1} scrollable={true}  className={"container-fluid"}>
                                           <h3 className="orderDeatilsHeading">My Profile</h3>
                                           <button className=" btn btn-light" onClick={() => this.closeMyProfile()} className="btn btn-light closeBtn">&times;</button>
                                           <div>
                                               <div>First Name : {user.firstName}</div>
                                               <div>Last Name : {user.lastName}</div>
                                               <div>Email : {user.email}</div>
                                           </div>
                                        </Modal>
                                        <Modal isOpen={isUserDashBordOpen} style={customStyles1} scrollable={true}  className={"container-fluid"}>
                                            <div style={{ position: 'sticky', top: '10px' }}>
                                                <h3 className="orderDeatilsHeading" >Order Details</h3>
                                                <button className=" btn btn-light" onClick={() => this.closeOrderDetails()} className="btn btn-light closeBtn">&times;</button>
                                            </div>
                                            <ul className="">


                                                {this.showOrderDetails()}

                                            </ul>
                                        </Modal>
                                    </div>
                                    :
                                    <div className="" style={{}}>
                                        <button className="btn text-white" onClick={this.handleLoginButtonClick}>Login</button>
                                        <button className="btn btn-outline-light" onClick={this.handelSingUpButtonClicked}>Create an account</button>
                                    </div>
                            }
                        </div>
                        <Modal isOpen={isLoginModalOpen} style={customStyles} >
                            <h3>User Login</h3>
                            <form>
                                {
                                    loginError ? <div className="alert alert-danger">{loginError}</div> : null
                                }
                                <label className="form-label">Username:</label>
                                <input type="text" value={username} className="form-control" onChange={(event) => this.handleChange(event, 'username')} />
                                <br />
                                <label className="form-label">Password:</label>
                                <input type="password" value={password} className="form-control" onChange={(event) => this.handleChange(event, 'password')} />
                                <br />
                                <br />
                                <FacebookLogin
                                    appId="4356797374331461"
                                    autoLoad={false}
                                    fields="name,email,picture"
                                    onClick={this.componentClicked}
                                    callback={this.responseFacebookLogin}
                                    icon="bi bi-facebook p-2 m-2"
                                    cssClass="fb"
                                />
                                <br />
                                <Googlelogin
                                    clientId="946053029267-3osdvlorecoptosi14vh65g4k982ncvi.apps.googleusercontent.com"
                                    buttonText="Continue with Google"
                                    onSuccess={this.responseSuccessGooglelogin}
                                    onFailure={this.responseFailureGoogle}
                                    cookiePolicy={'single_host_origin'}
                                    className="google"
                                />
                                <br />
                                <br />
                                <input type="button" className="btn btn-primary" onClick={this.handleLogin} value="Login" />
                                <input type="button" className="btn" onClick={this.resetLoginForm} value="Cancel" />
                                <br/>
                                <hr/>
                                <div className="text-center">
                                    <p className="dontHaveAccount">Don't have account? <a className="signUpA pointer"  onClick={()=>this.handelSingUpButtonClicked()}>SignUp</a></p>
                                </div>
                            </form>
                        </Modal>

                        <Modal isOpen={isSingUpModalOpen} style={customStyles}>
                            <h3>User Singup</h3>
                            <form>
                                {
                                    singUpError ? <div className="alert alert-danger">{singUpError}</div> : null
                                }
                                <label className="form-label">First Name:</label>
                                <input type="text" value={firstName} className="form-control"  onChange={(event) => this.handleChange(event, 'firstName')} />
                                <label className="form-label">Last Name:</label>
                                <input type="text" value={lastName} className="form-control"  onChange={(event) => this.handleChange(event, 'lastName')} />
                                <label className="form-label">email:</label>
                                <input type="text" value={username}   className="form-control" onChange={(event) => this.handleChange(event, 'username')} />
                                <label className="form-label">Password:</label>
                                <input type="password" value={password} className="form-control"  onChange={(event) => this.handleChange(event, 'password')} />
                                <br />
                                <FacebookLogin
                                    appId="4356797374331461"
                                    autoLoad={false}
                                    fields="name,email,picture"
                                    onClick={this.componentClicked}
                                    callback={this.responseFacebookSuingUp}
                                    icon="bi bi-facebook p-2 m-2"
                                    cssClass="fb"
                                />
                                <br />
                                <Googlelogin
                                    clientId="946053029267-3osdvlorecoptosi14vh65g4k982ncvi.apps.googleusercontent.com"
                                    buttonText="Continue with Google"
                                    onSuccess={this.responseSuccessGoogle}
                                    onFailure={this.responseFailureGoogle}
                                    cookiePolicy={'single_host_origin'}
                                    className="google"
                                />
                                <br />
                                <br />
                                <input type="button" className="btn btn-primary" onClick={this.handleSingUp} value="Sing Up" />
                                <input type="button" className="btn" onClick={this.resetSingUpForm} value="Cancel" />
                                <br/>
                                <hr/>
                                <p className="dontHaveAccount">Already have an account? <a className="signUpA pointer" onClick={this.handleLoginButtonClick}>Login</a></p>
                            </form>
                        </Modal>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Header);