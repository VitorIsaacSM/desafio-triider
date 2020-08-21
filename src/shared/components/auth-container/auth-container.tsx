import { Component, Dispatch } from "react";
import { connect } from "react-redux";
import { setUsuario, CustomAction } from "store/actions";
import { Usuario } from "shared/models/user";

class AuthContainer extends Component<any> {
    componentWillMount() {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (user && token) {
          this.props.setUser(JSON.parse(user), token);
        }
    }

    render() {
        return this.props.children; 
    }
}

const mapDispatchToProps = (dispatch: Dispatch<CustomAction>) => {
    return {
        setUser: (user: Usuario, token: string) => dispatch(setUsuario(user, token))
    }
}

export default connect(null, mapDispatchToProps)(AuthContainer);