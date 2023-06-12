import React, { Fragment, useEffect, useState } from 'react'
import "./Products.css";
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, getProduct } from '../../actions/productAction';
import Loader from "../layout/Loader";
import ProductCard from '../Home/ProductCard';
import Pagination from "react-js-pagination"
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
// import Typography from "@material-ui/core/Typography";

const categories = [
    "Sofas and armchairs",
    "Chairs",
    "Poufs",
    "Lighthing",
    "Dining table",
    "Bed",
    "Wardrobe",
    "Gaming Chairs"
];

const Products = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const { products, loading, error, productsCount, resultPerPage } = useSelector(state => state.products);
    const [currrentPage, setCurrentPage] = useState(1)
    const [category, setCategory] = useState("");

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct(currrentPage, category))
    }, [dispatch, currrentPage, category, alert, error])

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title="Products" />
                    <h2 className='productsHeading'>Products</h2>
                    <div className='categoryBar'>
                        {/* <Typography>Categories</Typography> */}
                        <ul className='categoryBox'>
                            {categories.map((category) => (
                                <li
                                    className='category-link'
                                    key={category}
                                    onClick={() => setCategory(category)}>
                                    {category}
                                </li>
                            ))}
                        </ul>

                    </div>
                    <div className='products'>
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    {resultPerPage < productsCount && <div className='paginationBox'>
                        <Pagination
                            activePage={currrentPage}
                            itemsCountPerPage={resultPerPage}
                            totalItemsCount={productsCount}
                            onChange={setCurrentPageNo}
                            nextPageText="Next"
                            prevPageText="Prev"
                            firstPageText="1st"
                            lastPageText="Last"
                            itemClass="page-item"
                            linkClass="page-link"
                            activeClass="pageItemActive"
                            activeLinkClass="pageLinkActive"
                        />
                    </div>}
                </Fragment>}
        </Fragment>
    )
}

export default Products
