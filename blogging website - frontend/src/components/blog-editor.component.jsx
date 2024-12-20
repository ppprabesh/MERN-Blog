import { Link } from "react-router-dom"
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png"
import { useState } from "react";


const BlogEditor = () =>{
  const [ banner , setBanner] = useState(defaultBanner)

    const handleBannerUpload = (e)=>{
         let img = e.target.files[0];
         if(img)
         {
          const imageUrl = URL.createObjectURL(img);
          setBanner(imageUrl);
         }
         
    }
    return(
       <> 
       <nav className="navbar">
          <Link to="/" className= "flex-none w-10">
          <img src={logo} alt="Logo"/>
          </Link>
          <p className="max-md:hidden text-black
          line-clamp-1 w-full">
            New blog
          </p>

          <div className="flex gap-4 ml-auto">
              <button className="btn-dark py-2">
                Publish</button>
              <button className="btn-light py-2">
                Save Draft</button>
                

          </div> 

      </nav>
      
      <AnimationWrapper>
          <section>
            <div className="max-auto max-w-[900px] w-full">
             
              <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">
                <label htmlFor="uploadBanner">
                  <img
                  src={banner}
                  className="z-20 "
                  />
                  <input
                  id="uploadBanner"
                  type="file"
                  accept=" .png, .jpg, .jpeg"
                  hidden    
                  onChange={handleBannerUpload}             
                  />
                </label>
              </div>

            </div>
          </section>

      </AnimationWrapper>
 

       </>
     
    )
}


export default BlogEditor