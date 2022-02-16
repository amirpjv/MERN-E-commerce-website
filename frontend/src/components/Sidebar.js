import '../sidebar.css';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { slide as Menu } from 'react-burger-menu';
import { ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { listProductCategories } from '../actions/productActions';
import LoadingBox from './Loader';
import MessageBox from './Message';

const Sidebar = () => {
    const dispatch = useDispatch();
    const [isOpen, setOpen] = useState(false)
    const productCategoryList = useSelector((state) => state.productCategoryList);
    const {
        loading: loadingCategories,
        error: errorCategories,
        categories,
    } = productCategoryList;
    useEffect(() => {
        dispatch(listProductCategories());
    }, [dispatch]);

    const handleIsOpen = () => {
      setOpen(!isOpen)
    }
    const closeSideBar = () => {
      setOpen(false)
    }
    return (
        <Menu
        isOpen={isOpen}
        onOpen={handleIsOpen}
        onClose={handleIsOpen}
        >
            <ListGroup variant='flush'>
                <strong>Categories</strong>
                {loadingCategories ? (
                    <LoadingBox></LoadingBox>
                ) : errorCategories ? (
                    <MessageBox variant="danger">{errorCategories}</MessageBox>
                ) : (
                            categories.map((c) => (
                                <ListGroup.Item key={c} className="hover-underline-animation bg-transparent">
                                    <Link
                                        className="text-decoration-none"
                                        to={`/search/category/${c}`}
                                        onClick={closeSideBar}
                                    >
                                        {c}
                                    </Link>
                                </ListGroup.Item>
                            ))
                        )}
            </ListGroup>
        </Menu >
    );
};

export default Sidebar