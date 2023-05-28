import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

export default function App() {
  const [listOfFiles, setListOfFiles] = useState([]);
  const [fileContent, setFileContent] = useState({});
  const getData = () => {
    electronAPI
      .requestData()
      .then((data) => {
        electronAPI
          .requestFileContent(data[0])
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
      .requestFileContent(event.target.value)
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
      <h1>I am App</h1>
      <button onClick={getData}>Notify</button>
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
      <div>
        <p>Name:{fileContent?.name}</p>
        <p>IP:{fileContent?.ip}</p>
      </div>
      <div>
        <Container>
          <Row>
            {fileContent?.commands?.map((item, index) => {
              return (
                <Col key={index}>
                  <Button style={{ background: item.color }}>
                    {item.name}
                  </Button>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
    </>
  );
}
