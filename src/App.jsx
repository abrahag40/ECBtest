import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";
import { Formik, Field, Form } from "formik";
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { FiTool } from "react-icons/fi";

function App() {
  let maintenance_ = "";
  const [cars, setCars] = useState([]);
  const [mantenimiento, Setmantenimiento] = useState(false);
  const [show, setShow] = useState(false);
  const [fechaEntrega_, setFechaEntrega] = useState("")
  const handleClose = () => {
    setShow(false);
    localStorage.removeItem("carData");
  };
  const handleShow = () => setShow(true);
  console.log(maintenance_);
  let iAddress = useRef([React.createRef(), React.createRef()]);

  const uri = "http://8ddcd716cebc.ngrok.io/";

  useEffect(() => {
    axios
      .get(uri)
      .then((response) => {
        setCars(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlerPost = () => {
    axios
      .post(`${uri}/send-data`, {
        description: "12223",
        make: "123",
        model: "123",
        estimatedate: "123",
        id: "123",
        image: "123",
        km: "22",
        maintenance: true,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handlerUpdate = (fechaEntrega, responsable) => {
    let carData = JSON.parse(localStorage.getItem("carData"));
    maintenance_ = carData.maintenance ? false : true;
    console.log('fechaEntrega--',fechaEntrega);
    axios
      .post(`${uri}upload`, {
        id: carData._id,
        estimatedate: fechaEntrega.toString(),
        maintenance: maintenance_,
        responsable: responsable.toString()
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
      handleClose()
      setTimeout(() => {
        window.location.reload();
      }, 600);
  };

  const dataCar = (carData) => {
    localStorage.setItem("carData", JSON.stringify(carData));
    handleShow();
  };

  const SignupSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    fechaEntrega: Yup.string().required("Required"),
  });

  console.log("--", maintenance_);
  return (
    <>
      <div className="container">
        <div className="row" style={{ padding: "60px 0px" }}>
          <div className="col-12 d-flex justify-content-center">
            <img src="/ECB.png"></img>
          </div>
        </div>
        <div className="row">
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col"></th>
                <th scope="col">Id</th>
                <th scope="col">Make</th>
                <th scope="col">Model</th>
                <th scope="col">Description</th>
                <th scope="col">Estimate date</th>
                <th scope="col">KM</th>
                <th scope="col">Manteinance</th>
              </tr>
            </thead>
            <tbody>
              {cars
                ? cars.map((res, index) => {
                    let id = res.id_ ? res.id_ : "-";
                    let make = res.make ? res.make : "-";
                    let model = res.model ? res.model : "-";
                    let description = res.description ? res.description : "-";
                    let estimatedate = res.estimatedate
                      ? res.estimatedate
                      : "-";
                    let image = res.image ? res.image : "-";
                    let km = res.km ? res.km : "-";
                    return (
                      <>
                        <tr>
                          <td>
                            {" "}
                            <img src={image} width="150" height="80" />{" "}
                          </td>
                          <td>{id}</td>
                          <td>{make}</td>
                          <td> {model} </td>
                          <td> {description} </td>
                          <td> {estimatedate} </td>
                          <td> {km} </td>
                          <td
                            className="d-flex"
                            style={{ justifyContent: "center" }}
                          >
                            <div>
                              <input
                                type="checkbox"
                                onClick={dataCar.bind(this, res)}
                                className="form-check-input"
                              />
                              <span style={{ paddingLeft: "10px" }}>
                                {res.maintenance ? <FiTool /> : ""}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })
                : ""}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton />
        <Modal.Body>
          <Formik
            initialValues={{
              name: "",
              fechaEntrega: "",
            }}
            validationSchema={SignupSchema}
            // onSubmit={(handleClose, handlerUpdate, setFechaEntrega(fechaEntrega))}
            onSubmit={values => {
              handlerUpdate(values.fechaEntrega, values.name)
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="name">Nombre</label>
                  <Field name="name" className="form-control" />
                  {errors.name && touched.name ? (
                    <div>{errors.name}</div>
                  ) : null}
                </div>

                <div className="form-group">
                  <label htmlFor="fechaEntrega">Fecha Entrega</label>
                  <Field name="fechaEntrega" className="form-control" placeholder="dd/mm/yyyy" />
                  {errors.fechaEntrega && touched.fechaEntrega ? (
                    <div>{errors.fechaEntrega}</div>
                  ) : null}
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex justify-content-center">
                    <Button type="submit">Enviar</Button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default App;
