import React, { useState } from "react";
import ReactDOM from "react-dom";
import { MongoClient } from "mongodb";

const App = () => {
  const [formData, setFormData] = useState({
    title: "",
    headerImage: "",
    questions: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { type: "", question: "", options: [], answers: [] }],
    });
  };

  const handleEditQuestion = (index) => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions.slice(0, index),
        { type: "", question: "", options: [], answers: [] },
        ...formData.questions.slice(index + 1),
      ],
    });
  };

  const handleDeleteQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((question, i) => i !== index),
    });
  };

  const handleSave = () => {
    const client = new MongoClient("mongodb://localhost:27017");
    client.connect().then((db) => {
      const collection = db.collection("forms");
      collection.insertOne(formData).then(() => {
        console.log("Form saved!");
      });
    });
  };

  return (
    <div>
      <h1>Form Editor</h1>
      <form onSubmit={handleSave}>
        <div>
          <label for="title">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div>
          <label for="headerImage">Header Image</label>
          <input type="file" name="headerImage" onChange={handleChange} />
        </div>
        <div>
          <h2>Questions</h2>
          {formData.questions.map((question, i) => (
            <div key={i}>
              <h3>{question.question}</h3>
              <button onClick={() => handleEditQuestion(i)}>Edit</button>
              <button onClick={() => handleDeleteQuestion(i)}>Delete</button>
            </div>
          ))}
          <button onClick={handleAddQuestion}>Add Question</button>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
