import React, { useState } from 'react';
import axios from 'axios';

function App() {

  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('')
  const [image, setImage] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [imageurl, setimageurl] = useState('')

  const handlepromptChange = (e) => {
    setPrompt(e.target.value);
  };
  const handleNegativePromptChange = (e) => {
    setNegativePrompt(e.target.value);
  };

  const handleimageChange = (e) => {
  const file = e.target.files[0];
    setImage(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('prompt',prompt)
      formData.append('negativePrompt', negativePrompt);
      formData.append('imageFile', image);
      


      const response = await axios.post('https://beta-sdk.photoroom.com/v1/instant-backgrounds', formData, {
        headers: {
          'x-api-key': 'xyzyourapikey', // Replace with your API key
           'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'arraybuffer',
      });
      
      const arrayBufferView = new Uint8Array(response.data);
      const blob = new Blob([arrayBufferView], { type: 'image/png' });
      const url = URL.createObjectURL(blob);

      setApiResponse(response.data);
      console.log(apiResponse); //just to check when you've exhausted the api
      setimageurl(url);
    } catch (error) {
      console.error('API request failed:', error);
    }
  };

  return (
    <div className='container-fluid'>
    <h1>Background Changer</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Prompt:
          <input type="text" value={prompt} onChange={handlepromptChange} />
        </label>
      </div>

      <div>
          <label>
            Negative prompt:
            <input type="text" value={negativePrompt} onChange={handleNegativePromptChange} />
          </label>
      </div>  

      <div className='grid'>
      <div>
        <label>
          Initial Image:
          <input type="file"
              accept="image/jpeg, image/png" onChange={handleimageChange} />
        </label>
      </div>
      
      </div>
      
      <button type="submit">Generate</button>
    </form>

    {apiResponse !== null && (
      <hgroup>
      <h2>Response Image : </h2>
      <img src={imageurl}></img>
      </hgroup>
      )}
  </div>
  )
}

export default App
