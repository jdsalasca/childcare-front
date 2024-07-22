import React from 'react';

const HomePage = () => {
  return (
    <div className="homepage">
      <h1 className="homepage-title">Welcome to Educando</h1>
      <div className="container-homepage-background" style={{ marginTop: "10px" }}>
        <img
          src={`${process.env.PUBLIC_URL}/homepage_image.jpg`}
          alt="Cover"
          style={{ maxWidth: '900px', maxHeight: '600px', display: 'block', margin: 'auto' }}
        />
      </div>
    </div>
  );
};

export default HomePage;
