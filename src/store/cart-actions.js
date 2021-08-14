import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";
/**
 * Fetch cart data from book store DB and update the redux store.
*/
export const fetchCartData = () => {
  return async (dispatch) => {
    /**
     * fetch all card data from firebase
     * @returns json data
     */
    const fetchData = async () => {
      const response = await fetch('https://bookstore-657fa-default-rtdb.firebaseio.com/cart.json'
      );
      if (!response.ok) {
        throw new Error('could not fetch data!.');
      }
      const data = await response.json()
      return data;

    };
    // update the cart with data from firebase
    try {
      const cartData = await fetchData();
      console.log(cartData)
      dispatch(cartActions.replaceCart({
        items: cartData.items || [],
        totalQuantity: cartData.totalQuantity,
      }));
    } catch (error) {
      console.log(error)
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'fetching cart data failed!'
        })
      );
    }
  };

};

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: 'pending',
        title: 'Sending',
        message: 'Sending cart data!'
      })
    );

    const sendRequest = async () => {
      const response = await fetch('https://bookstore-657fa-default-rtdb.firebaseio.com/cart.json',
        {
          method: 'PUT',
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity
          }),
        }
      );


      if (!response.ok) {
        throw new Error('Sending Cart data failed.')
      }
    };
    try {
      await sendRequest();

      dispatch(uiActions.showNotification({
        status: 'success',
        title: 'Success!',
        message: 'Sent cart data successfully!'
      })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Sending cart data failed!'
        })
      );
    }
  };
};
