import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

export default function App() {
  const [listOfFiles, setListOfFiles] = useState([]);
  const [fileContent, setFileContent] = useState({});
  const getData = () => {
    electronAPI
      .requestAllFiles("/home/user/Videos/environment")
      .then((data) => {
        electronAPI
          .requestFileContent("/home/user/Videos/environment/" + data[0])
          .then((data) => {
            setFileContent(data);
          })
          .catch((error) => {
            console.error("Error retrieving data:", error);
          });

        setListOfFiles(data);
      })
      .catch((error) => {
        console.error("Error retrieving data:", error);
      });
  };
  const onChange = (event) => {
    electronAPI
      .requestFileContent("/home/user/Videos/environment/" + event.target.value)
      .then((data) => {
        setFileContent(data);
      })
      .catch((error) => {
        console.error("Error retrieving data:", error);
      });
  };
  const onClickBtn = (cmdWithArgs) => {
    electronAPI
      .executeCommand(cmdWithArgs)
      .then((data) => {
        setFileContent(data);
      })
      .catch((error) => {
        console.error("Error retrieving data:", error);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <Container>
        <h1>From App.js</h1>
        <Container>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Location of Machines dump</Form.Label>
            <Form.Control type="text" placeholder="" />
          </Form.Group>
          <Form.Select
            aria-label="Default select example"
            onChange={(event) => onChange(event)}
          >
            {listOfFiles.map((item, id) => {
              return (
                <option value={item} key={id}>
                  {item}
                </option>
              );
            })}
          </Form.Select>
        </Container>
        {/* <div>
          <p>Name:{fileContent?.name}</p>
          <p>IP:{fileContent?.ip}</p>
        </div> */}
        <div>
          <Container style={{ marginTop: "10px" }}>
            <Row>
              {fileContent?.commands?.map((item, index) => {
                return (
                  <Col key={index}>
                    <Button
                      style={{ background: item.color }}
                      onClick={() => onClickBtn(item.command)}
                    >
                      {item.name}
                    </Button>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </div>
      </Container>
    </>
  );
}
