import React, { memo } from "react";
import {
    Switch,
    Route,
    useHistory
} from "react-router-dom";

import Breadcrumbs from '../Breadcrumbs';
import AdminRoutes from "../../router/admin";
import { connect } from "react-redux";
import AllowedContainer from "./AllowedContainer";


const Pages = ({ user }) => {
    const history = useHistory();
    const routes = AdminRoutes.map(route => {
        if (route.list) {
            return route.list;
        }

        return route;
    }).flat();

    console.log({routes})
    
    return (
        <Switch>
            {routes
                // .filter(route => route.path)
                .map((route, i) => (
                    <Route
                        key={i}
                        path={"/dashboard" + route.path}
                        exact
                        component={() => (
                            <div>
                                <Breadcrumbs {...route} />
                                <AllowedContainer user={user} route={route}>
                                    {React.cloneElement(route.content, {
                                        history
                                    })}
                                </AllowedContainer>
                            </div>
                        )}
                    ></Route>
                ))}
        </Switch>
        
    )
};

const mapStateToProps = ({ user }) => ({ user })

export default memo(connect(mapStateToProps)(Pages));