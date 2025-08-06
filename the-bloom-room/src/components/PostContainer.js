import img from "../assets/images/Tomato.jpeg";
import img1 from "../assets/images/artwork1.jpeg";
import img2 from "../assets/images/artwork2.jpeg";
import img3 from "../assets/images/artwork3.jpeg";
import"./css/PostContainer.css"; // Ensure this path is correct"

function PostContainer() {
  return (
    <div className="post-container">
        <div className="post-frame">
      <img src={img} alt="Post" className="post-image" />
      </div>
      <div className="post-frame">
      <img src={img1} alt="Post" className="post-image" />
      </div>
      <div className="post-frame">
      <img src={img2} alt="Post" className="post-image" />
      </div>
      <div className="post-frame">
      <img src={img2} alt="Post" className="post-image" />
      </div>
         <div className="post-frame">
      <img src={img} alt="Post" className="post-image" />
      </div>
       <div className="post-frame">
      <img src={img3} alt="Post" className="post-image" />
      </div>
       <div className="post-frame">
      <img src={img1} alt="Post" className="post-image" />
      </div>
          <div className="post-frame">
      <img src={img3} alt="Post" className="post-image" />
      </div>
      
    </div>
  );
}   
export default PostContainer