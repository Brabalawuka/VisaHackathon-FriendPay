import Img1 from '../../images/anchor-bracelet-mens.jpg';
import Img2 from '../../images/bright-red-purse-with-gold.jpg';
import Img3 from '../../images/red-t-shirt.jpg';

const initState = {
  items: [
    { id: 1, title: "Chocolate", brand: "Adidas", price: 420, img: Img1 },
    { id: 2, title: "Vanilla", brand: "Yeezys", price: 200, img: Img2 },
    { id: 3, title: "Butterscotch", brand: "Vans", price: 250, img: Img3 }
  ]
}

const cartReducer = (state = initState, action) => {
  return state;
}

export default cartReducer;