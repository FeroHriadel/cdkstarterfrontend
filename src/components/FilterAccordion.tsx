import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchItems } from '../actions/itemActions';
import Accordion from 'react-bootstrap/Accordion';
import { Form } from 'react-bootstrap';





const initialValues = {category: '', tag: ''};




function FilterAccordion() {
  //VALUES
  const dispatch: AppDispatch = useDispatch(); //dispatch like e.g.: dispatch(changeMessage('No tags found'));
  const tags = useSelector((state: RootState) => state.tags);
  const categories = useSelector((state: RootState) => state.categories);
  const items = useSelector((state: RootState) => state.items);
  const [values, setValues] = useState(initialValues);



  //METHODS
  useEffect(() => {
    if (values === initialValues) return //to prevent unnecessary initial get items call

    let query: {[key: string]: string} | null = {...values};

    if (values.category === '') delete query?.category;
    if (values.tag === '') delete query?.tag;
    if (Object.keys(query).length === 0) query = null;

    dispatch(fetchItems(query));
  }, [values])



  //RENDER
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Filter Items</Accordion.Header>
        <Accordion.Body>
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <Form style={{textAlign: 'left'}}>

                {/* CATEGORY */}
                <Form.Group className="mb-3" controlId="formCategory">
                  <Form.Label>Category</Form.Label>
                  <Form.Select value={values.category} onChange={(e) => {setValues({...values, category: e.target.value})}} >
                      <option value=''>No category selected</option>
                      {
                          categories.map(c => (
                              <option value={c.categoryId} key={c.categoryId}>{c.name}</option>
                          ))
                      }
                  </Form.Select>
                </Form.Group>

                {/* TAG */}
                <Form.Group className="mb-3" controlId="formCategory">
                  <Form.Label>Tag</Form.Label>
                  <Form.Select value={values.tag} onChange={(e) => {setValues({...values, tag: e.target.value})}} >
                      <option value=''>No tag selected</option>
                      {
                          tags.map(t => (
                              <option value={t.tagId} key={t.tagId}>{t.name}</option>
                          ))
                      }
                  </Form.Select>
                </Form.Group>
              </Form>
            </div>
          </div>      

        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default FilterAccordion;