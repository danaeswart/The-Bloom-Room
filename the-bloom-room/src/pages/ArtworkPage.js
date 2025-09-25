// import React, { useState } from "react";
// import "./css/ArtworkPage.css";
// import artwork1 from "../assets/images/artwork1.jpeg"; // Replace with actual image paths      
// import artwork2 from "../assets/images/artwork2.jpeg"; // Replace with actual image paths      
// import artwork3 from "../assets/images/artwork3.jpeg";
// import Navbar from "../components/Navbar";
// const ArtworkPage = () => {
//   const images = [
//     artwork1,
//     artwork2,
//     artwork3,
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [direction, setDirection] = useState("right");

//   const nextImage = () => {
//     setDirection("right");
//     setCurrentIndex((prev) => (prev + 1) % images.length);
//   };

//   const prevImage = () => {
//     setDirection("left");
//     setCurrentIndex((prev) =>
//       prev === 0 ? images.length - 1 : prev - 1
//     );
//   };



//   // code for submit button from chat 
//   const commentForm = document.getElementById("comment-form");
// const commentInput = document.getElementById("comment-input");
// const commentsList = document.getElementById("comments-list");

// // commentForm.addEventListener("submit", function(e) {
// //   e.preventDefault();

// //   const text = commentInput.value.trim();
// //   if (!text) return;

// //   const commentDiv = document.createElement("div");
// //   commentDiv.className = "comment";

// //   const nameSpan = document.createElement("span");
// //   nameSpan.className = "comment-name";
// //   nameSpan.textContent = "You"; // change to username if available

// //   const textP = document.createElement("p");
// //   textP.className = "comment-text";
// //   textP.textContent = text;

// //   commentDiv.appendChild(nameSpan);
// //   commentDiv.appendChild(textP);

// //   // prepend new comment at the top
// //   commentsList.insertBefore(commentDiv, commentsList.firstChild);

// //   commentInput.value = "";
// // });


//   return (
//     <>
//     <Navbar />
//     <div className="artwork-page">
//       {/* Left - Carousel */}
//       <div className="carousel">
//         <button className="arrow left" onClick={prevImage}>
//           &#10094;
//         </button>

//         <div className={`image-container ${direction}`}>
//           <img
//             key={currentIndex}
//             src={images[currentIndex]}
//             alt={`Artwork ${currentIndex + 1}`}
//           />
//         </div>

//         <button className="arrow right" onClick={nextImage}>
//           &#10095;
//         </button>
//       </div>

//       {/* Right - Artwork Info */}
//       <div className="artwork-info">
//         <h2 className="art-title">Starry Dreams</h2>
//         <p className="artist-name">by <span>danae</span></p>

//         <h4>Description:</h4>
//         <div className="description-box">
//           A dreamy night sky painting inspired by Van Gogh’s swirling stars,
//           using vibrant blues and yellows to capture movement and emotion.
//         </div>

//         <h4>Medium:</h4>
//         <p className="medium">Acrylic paint on canvas</p>

//         <h4>Price:</h4>
//         <p className="medium">R1200</p>

//         <button className="request-btn">Send Request</button>
//       </div>

    

//     </div>

//     <div class="comment-section">
//   <h3>Comments</h3>

//   <form id="comment-form" class="comment-form">
//     <input type="text" id="comment-input" placeholder="Add a comment..." />
//     <button type="submit">Post</button>
//   </form>

//   <div id="comments-list" class="comments-list">
//     <div>
//       <h4>uername:</h4>
//       <hr/>
//      <p>comentttss woow i like it </p>
//     </div>
   
    
//   </div>
// </div>

//     </>
//   );
// };

// export default ArtworkPage;
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./css/ArtworkPage.css";
import Navbar from "../components/Navbar";
import axios from "axios";

const ArtworkPage = () => {
  const { artworkId } = useParams(); // from /artwork/:id
  const [artwork, setArtwork] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("right");

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/artworks/${artworkId}`);
        setArtwork(res.data);
        console.log("Fetched artwork:", res.data);
      } catch (err) {
        console.error("Error fetching artwork:", err);
      }
    };

    fetchArtwork();
  }, [artworkId]);

  const nextImage = () => {
    if (!artwork?.Images?.length) return;
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % artwork.Images.length);
  };

  const prevImage = () => {
    if (!artwork?.Images?.length) return;
    setDirection("left");
    setCurrentIndex((prev) =>
      prev === 0 ? artwork.Images.length - 1 : prev - 1
    );
  };

  if (!artwork) return <p>Loading artwork...</p>;

  return (
    <>
      <Navbar />
      <div className="artwork-page">
        {/* Left - Carousel */}
        <div className="carousel">
          {artwork.Images?.length > 0 && (
            <>
              <button className="arrow left" onClick={prevImage}>
                &#10094;
              </button>

              <div className={`image-container ${direction}`}>
                <img
                  key={currentIndex}
                  src={`http://localhost:5000${artwork.Images[currentIndex].Image_URL}`}
                  alt={`Artwork ${currentIndex + 1}`}
                />
              </div>

              <button className="arrow right" onClick={nextImage}>
                &#10095;
              </button>
            </>
          )}
        </div>

        {/* Right - Artwork Info */}
        <div className="artwork-info">
          <h2 className="art-title">{artwork.Artwork_Name}</h2>
          <p className="artist-name">
           by <span>{artwork.Artist_Username}</span>{/* later replace with artist name */}
          </p>
          

          <h4>Description:</h4>
          <div className="description-box">{artwork.Description}</div>

          <h4>Medium:</h4>
          <p className="medium">{artwork.Medium}</p>

          <h4>Price:</h4>
          <p className="medium">R{artwork.Price}</p>

          <button className="request-btn">Send Request</button>
        </div>
      </div>
    </>
  );
};

export default ArtworkPage;
