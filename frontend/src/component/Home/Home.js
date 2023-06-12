import React, { Fragment, useEffect } from 'react'
// import { CgMouse } from "react-icons/all";
import "./Home.css";
// import Product from "./ProductCard.js"
import MetaData from '../layout/MetaData';
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader"
import { useAlert } from 'react-alert';
import ProductCard from './ProductCard.js';
import { Link } from 'react-router-dom';

const Home = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, error, products,
    } = useSelector(
        (state) => state.products);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct());
    }, [dispatch, error, alert]);

    return (
        <Fragment>

            {loading ? (<Loader />) : <Fragment>

                <MetaData title="Furnitures" />
                <Link to="/products">
                    <div className="banner1">
                        <img src='./banner4.png' alt='img' />
                    </div>
                </Link>

                <h1 className='homeHeading'>Room Furniture</h1>
                <p className='des'>The essence of every home is in the living room. What adds character to it is
                    the living room furniture that represents your taste, comfort, and style. Anywhere from sleek modern
                    furniture to elegant wooden furniture, buying the ones that suit your needs is just a scroll and a
                    click away when you purchase furniture online. As one of the best online furniture stores, Wakefit has
                    living room furniture, work from home furniture, bedroom furniture, and an array of furniture that are
                    aesthetic and functional to suit all your needs.</p>

                <h2 className="homeHeading">Top Rated Furnitures</h2>

                <div className="container" id="container">

                    {products && products.map((product) => <ProductCard key={product._id} product={product} />)}

                </div>

            </Fragment>}
        </Fragment>
    );
};

export default Home;
