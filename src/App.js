import { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import {
  Tabs,
  Tab,
  Card,
  ListGroup,
  ListGroupItem,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";

import api from "./services/api.service";
import XMLParser from "react-xml-parser";

function App() {
  const [type, setSearchType] = useState("");
  const [value, setSearchValue] = useState("");
  const [requestData, setRequestData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [pricerFipeData, setPricerFipeData] = useState([]);
  const [pricerMolicarsData, setPricerMolicarsData] = useState([]);
  const [pricerVenalData, setPricerVenalData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const list = () => {
    if (type && value) {
      setLoading(true);
      setShowAlert(false);

      try {
        api
          .get(`/v1/Asset/fipe/${type}/${value}`)
          .then((response) => {
            var xml = response.data.result.result;

            var index = xml.indexOf("</SOLICITACAO>") + "</SOLICITACAO>".length;
            var requestData = xml.substring(0, index);
            var jsonRequest = new XMLParser().parseFromString(requestData);

            if (jsonRequest) {
              setRequestData(jsonRequest.children);
            }

            var vehicleData = xml.substring(index, xml.length - index);
            var jsonVehicleData = new XMLParser().parseFromString(vehicleData);

            if (jsonVehicleData) {
              setVehicleData(jsonVehicleData.children[0].children[0].children);
              setPricerFipeData(
                jsonVehicleData.children[0].children[1].children[0].children[0]
                  .children
              );
              setPricerMolicarsData(
                jsonVehicleData.children[0].children[1].children[1].children[0]
                  .children
              );
              setPricerVenalData(
                jsonVehicleData.children[0].children[1].children[2].children[0]
                  .children
              );
            }

            setLoading(false);
          })
          .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
            setLoading(false);
          });
      } catch (error) {
        console.error("ops! ocorreu um erro" + error);
        setLoading(false);
      }
    } else {
      setShowAlert(true);
      setLoading(false);
    }
  };

  return (
    <>
      <div className='container py-3'>
        <header>
          <div className='d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom'>
            <a
              href='/'
              className='d-flex align-items-center text-dark text-decoration-none'>
              <span className='fs-4'>Olhar Fixo</span>
            </a>

            <nav className='d-inline-flex mt-2 mt-md-0 ms-md-auto'>
              <form className='d-flex'>
                <Form.Select
                  defaultValue='Choose...'
                  onChange={(e) => setSearchType(e.target.value)}
                  className='form-control me-2'>
                  <option>Tipo...</option>
                  <option>PLACA</option>
                  <option>CHASIS</option>
                </Form.Select>
                <input
                  className='form-control me-2'
                  type='search'
                  placeholder='Valor'
                  aria-label='Search'
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button
                  className='btn btn-outline-success'
                  type='button'
                  onClick={() => list()}>
                  Buscar
                </button>
              </form>
            </nav>
          </div>
          <div className='pricing-header p-3 pb-md-4 mx-auto text-center'>
            <h1 className='display-4 fw-normal'>Assets</h1>
            <Spinner
              animation='border'
              style={loading ? {} : { display: "none" }}
            />
            <div
              class='alert alert-warning'
              role='alert'
              style={showAlert ? { display: "block" } : { display: "none" }}>
              Informe tipo e valor para pesquisa. Ex: Tipo: PLACA, valor:
              AAA1111
            </div>
          </div>
        </header>

        <main>
          <div className='row row-cols-1 row-cols-md-3 mb-3 '>
            <div className='col'>
              <Card>
                <Card.Body>
                  <Card.Title>Solicitação</Card.Title>
                </Card.Body>

                <Card.Body>
                  <ListGroup className='list-group-flush'>
                    {requestData.length &&
                      requestData.map((item) => (
                        <ListGroupItem>
                          <h6>{item.name}:</h6>
                          <span className='data-value'>{item.value}</span>
                        </ListGroupItem>
                      ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </div>
            <div className='col'>
              <Card>
                <Card.Body>
                  <Card.Title>Dados do veículo</Card.Title>
                </Card.Body>

                <Card.Body>
                  <ListGroup className='list-group-flush'>
                    {vehicleData.length &&
                      vehicleData.map((item) => (
                        <ListGroupItem>
                          <h6>{item.name}:</h6>
                          <span className='data-value'>{item.value}</span>
                        </ListGroupItem>
                      ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </div>

            <div className='col'>
              <Card>
                <Card.Body>
                  <Card.Title>Precificadores</Card.Title>
                </Card.Body>

                <Card.Body>
                  <Card>
                    <Card.Body>
                      <Card.Title>FIPE</Card.Title>
                    </Card.Body>

                    <Card.Body>
                      <ListGroup className='list-group-flush'>
                        {pricerFipeData.length &&
                          pricerFipeData.map((item) => (
                            <ListGroupItem>
                              <h6>{item.name}:</h6>
                              <span className='data-value'>{item.value}</span>
                            </ListGroupItem>
                          ))}
                      </ListGroup>
                    </Card.Body>
                  </Card>

                  <Card>
                    <Card.Body>
                      <Card.Title>MOLICARS</Card.Title>
                    </Card.Body>

                    <Card.Body>
                      <ListGroup className='list-group-flush'>
                        {pricerMolicarsData.length &&
                          pricerMolicarsData.map((item) => (
                            <ListGroupItem>
                              <h6>{item.name}:</h6>
                              <span className='data-value'>{item.value}</span>
                            </ListGroupItem>
                          ))}
                      </ListGroup>
                    </Card.Body>
                  </Card>

                  <Card>
                    <Card.Body>
                      <Card.Title>BASE_VENAL</Card.Title>
                    </Card.Body>

                    <Card.Body>
                      <ListGroup className='list-group-flush'>
                        {pricerVenalData.length &&
                          pricerVenalData.map((item) => (
                            <ListGroupItem>
                              <h6>{item.name}:</h6>
                              <span className='data-value'>{item.value}</span>
                            </ListGroupItem>
                          ))}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
