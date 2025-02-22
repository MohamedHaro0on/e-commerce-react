import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { toast } from "react-toastify";
import Style from "./SingleProduct.module.css";
import Spinner from "../../Helpers/Spinner";
import Rating from "../../Helpers/Rating";
import ProductSecondaryCard from "../../Cards/ProductSecondaryCard/ProductSecondaryCard";
import bannerImage from "../../../assets/banner-11.jpg";
import bannerImage2 from "../../../assets/banner-4.png";
import ProductBunnerCard from "../../Cards/ProductBannerCard/ProductBannerCard";
import ImageSlider from "./ImageSliger";

const getDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
};

const SingleProduct = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [Product, SetProduct] = useState({});
  const [Products, SetProducts] = useState({});
  const [Categories, SetCategories] = useState({});
  const [Loading, SetLoading] = useState(true);
  const [ProductImage, SetProductImage] = useState("");
  const [SelectedImage, SetSelectedImage] = useState(0);

  const FetchData = async () => {
    let URL = `https://ecommerce.routemisr.com/api/v1/products/${id}`;
    let res = await fetch(URL);
    let Obj = await res.json();
    SetProduct(Obj["data"]);
    SetProductImage(Obj["data"]["imageCover"]);

    URL = `https://ecommerce.routemisr.com/api/v1/categories`;
    res = await fetch(URL);
    Obj = await res.json();
    SetCategories(Obj["data"]);

    URL = `https://ecommerce.routemisr.com/api/v1/products`;
    res = await fetch(URL);
    Obj = await res.json();
    SetProducts(Obj["data"]);

    SetLoading(false);
  };

  const { addToCart, addProductToWishlist } = useContext(CartContext);

  async function addProductToWish(id) {
    if (!localStorage.getItem("userName")) {
      navigate("/login");
      window.scrollTo(0, 0);
      return;
    }
    let res = await addProductToWishlist(id);
    console.log(res);
    if (res.status == "success") {
      toast.success(res.message, {
        position: "bottom-right",
        theme: "light",
        autoClose: 2500,
      });
    } else {
      toast.error("Failed");
    }
  }

  async function addProductToCart(id) {
    let res = await addToCart(id);
    if (!localStorage.getItem("userName")) {
      navigate("/login");
      window.scrollTo(0, 0);
      return;
    }
    if (res.status == "success") {
      toast.success(res.message, {
        position: "bottom-right",
        theme: "light",
        autoClose: 2500,
      });
    } else {
      toast.error("Failed");
    }
  }

  useEffect(() => {
    FetchData();
  }, [id]);
  return (
    <div className="py-5">
      {Loading ? (
        <Spinner />
      ) : (
        <>
          <div className="container pt-5">
            <div className="row">
              <div className="col-md-6 col-lg-5">
                <div className={`${Style.ImagContainer}`}>
                  <img
                    className={`${Style.mainimg}`}
                    id="mainimg"
                    src={ProductImage}
                    alt=""
                    // srcset=""
                  />
                </div>
                <ImageSlider
                  images={Product.images}
                  SetProductImage={SetProductImage}
                  SelectedImage={SelectedImage}
                  SetSelectedImage={SetSelectedImage}
                  NumberOfImages={4}
                />
              </div>
              <div className="col-md-6 col-lg-4">
                <h1>{Product.title}</h1>
                <div className="d-flex justify-content-between">
                  <p>
                    Brand:{" "}
                    <span className={`${Style.maincolor}`}>
                      {Product.brand.name}
                    </span>
                  </p>
                  <div className="">
                    <Rating rating={Product.ratingsAverage}></Rating>
                    <p className="d-inline pl-4" style={{ color: "#666" }}>
                      {Math.floor((Product.ratingsAverage / 5) * 100)}%
                    </p>
                  </div>
                </div>
                <hr />
                <div className={`${Style.price} `}>
                  <h1 className={`${Style.current_price}`}>
                    ${Product.price}.00
                  </h1>
                  <span className={`${Style.original_price}`}>
                    ${Product.price + Math.floor((Product.price * 20) / 100)}
                    .00
                  </span>
                  <span className={`${Style.off}`}>20% Off</span>
                </div>
                <hr />
                <p className="pb-4">{Product.description}</p>
                <div className={`${Style.details}`}>
                  <div className=" d-flex align-items-center py-2">
                    <i className="fa-regular fa-crown pr-3"></i>
                    <span>1 Year AL Jazeera Brand Warranty</span>
                  </div>
                  <div className=" d-flex align-items-center py-2">
                    <i className="fa-solid fa-arrow-rotate-left pr-3"></i>
                    <span>30 Day Return Policy</span>
                  </div>
                  <div className=" d-flex align-items-center py-2">
                    <i className="fa-solid fa-wallet pr-3"></i>
                    <span>Cash on Delivery available</span>
                  </div>
                </div>
                <div className="d-flex py-4">
                  <input
                    className={`${Style.quantity} mr-4`}
                    type="number"
                    placeholder="Quantity.."
                    min={1}
                    // value={1}
                    max={Product.quantity}
                  />
                  <button
                    onClick={() => addProductToCart(Product.id)}
                    className={`${Style.add_to_cart_button}`}
                  >
                    Add to cart
                  </button>
                  <button
                    onClick={() => addProductToWish(Product.id)}
                    className={`btn btn-outline-success ml-3 ${Style.add_to_wish} `}
                  >
                    <i className="fas fa-heart-circle-plus"></i>
                  </button>
                </div>
                <hr />
                <div className={`${Style.details}`}>
                  <p>
                    Date Added:{" "}
                    <span className={`${Style.maincolor}`}>
                      {getDate(Product.createdAt)}
                    </span>
                  </p>
                  <p>
                    Tags:{" "}
                    <span className={`${Style.maincolor}`}>
                      {Product.subcategory[0].slug}, {Product.category.slug},{" "}
                      {Product.brand.slug}
                    </span>{" "}
                  </p>
                  <p>
                    Availability:{" "}
                    <span className={`${Style.ItemsColor}`}>
                      {Product.quantity} Items In Stock
                    </span>
                  </p>
                  <p>
                    Sold:{" "}
                    <span className={`${Style.ItemsColor}`}>
                      {Product.sold} Items Sold
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-md-12 col-lg-3">
                <div className={`${Style.Category}`}>
                  <h3>Categores</h3>
                  <ul>
                    {Categories.map((Category) => (
                      <li key={Category._id}>{Category.name}</li>
                    ))}
                  </ul>
                </div>
                <div
                  className={`${Style.banner}`}
                  style={{
                    backgroundImage: `url(${bannerImage})`,
                  }}
                >
                  <p>Women Zone</p>
                  <h3>Save 20% on Office Dress</h3>
                  <Link to="/Products">
                    Shop Now&nbsp;&nbsp;&nbsp;
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="row">
              <div
                className={`${Style.banner}`}
                style={{
                  backgroundImage: `url(${bannerImage2})`,
                }}
              >
                <p>men's-clothing, women's-fashion</p>
                <h1>
                  All clothing you need will found it here
                  <br />
                  Save 20% on Office Dress
                </h1>
                <Link to="/Products">
                  Shop Now&nbsp;&nbsp;&nbsp;
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
            <div className="row  pt-4">
              {/* RelatedProducts */}
              <div className={`${Style.RelatedProducts} col-md-9`}>
                <h1>Related products</h1>
                <div className="d-flex flex-wrap">
                  {Products.filter(
                    (ele) => ele.category.slug === Product.category.slug
                  )
                    .slice(0, 8)
                    .map((CurProduct) => (
                      <ProductSecondaryCard
                        Product={CurProduct}
                        key={CurProduct._id}
                      />
                    ))}
                </div>
              </div>
              {/* New products */}
              <div className="col-md-3">
                <div className={`${Style.Category}`}>
                  <h3>New products</h3>
                  <div className="d-flex flex-column">
                    {Products.slice(9, 13).map((CurProduct, index) => (
                      <ProductBunnerCard key={index} Product={CurProduct} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SingleProduct;
