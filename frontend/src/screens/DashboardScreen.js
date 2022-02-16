import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chart from 'react-google-charts';
import { summaryOrder } from '../actions/orderActions';
import LoadingBox from '../components/Loader';
import MessageBox from '../components/Message';
import { Container, ListGroup, Row, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faShoppingCart, faMoneyBill } from '@fortawesome/free-solid-svg-icons'

export default function DashboardScreen() {
  const orderSummary = useSelector((state) => state.orderSummary);
  const { loading, summary, error } = orderSummary;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(summaryOrder());
  }, [dispatch]);
  return (
    <Container fluid>
      <Row>
        <h1>Dashboard</h1>
      </Row>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
            <Container fluid >
              <Row>
                <Card className="mt-3 mb-5">
                  <ListGroup className="d-flex flex-row justify-content-between">
                    <Card.Body>
                      <ListGroup.Item className="border-0 py-1 d-flex justify-content-evenly">
                        <h6>{summary.users[0].numUsers}</h6>
                        <FontAwesomeIcon icon={faUsers} className="text-primary mt-1" />
                      </ListGroup.Item>
                    </Card.Body>
                    <Card.Body>
                      <ListGroup.Item className="border-0 py-1 d-flex justify-content-evenly">
                        <h6>{summary.orders[0] ? summary.orders[0].numOrders : 0}</h6>
                        <FontAwesomeIcon icon={faShoppingCart} className="text-danger mt-1" />
                      </ListGroup.Item>
                    </Card.Body>
                    <Card.Body>
                      <ListGroup.Item className="border-0 py-1 d-flex justify-content-evenly">
                        <h6>
                          $
                          {summary.orders[0]
                            ? summary.orders[0].totalSales.toFixed(2)
                            : 0}
                        </h6>
                        <FontAwesomeIcon icon={faMoneyBill} className="text-success mt-1" />
                      </ListGroup.Item>
                    </Card.Body>
                  </ListGroup>
                </Card>
              </Row>
                <Container fluid>
                  <h2>Sales</h2>
                  {summary.dailyOrders.length === 0 ? (
                    <MessageBox>No Sale</MessageBox>
                  ) : (
                      <Chart
                        width="100%"
                        height="400px"
                        chartType="AreaChart"
                        loader={<div>Loading Chart...</div>}
                        data={[
                          ['Date', 'Sales'],
                          ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                        ]}
                      ></Chart>
                    )}
                </Container>
              <Container fluid>
                <h2>Categories</h2>
                {summary.productCategories.length === 0 ? (
                  <MessageBox>No Category</MessageBox>
                ) : (
                    <Chart
                      width="100%"
                      height="400px"
                      chartType="PieChart"
                      loader={<div>Loading Chart...</div>}
                      data={[
                        ['Category', 'Products'],
                        ...summary.productCategories.map((x) => [x._id, x.count]),
                      ]}
                    />
                  )}
              </Container>
            </Container>
          )}
    </Container>
  );
}
