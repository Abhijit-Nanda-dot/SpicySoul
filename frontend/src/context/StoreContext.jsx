import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StoreContext, defaultContextValue } from './store';

export const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState([]);
    // const devUrl ="http://localhost:4000";
    const url ="https://spicysoul.onrender.com";
   

    const [token,setToken] = useState("");
    const[food_list,setFoodList] =useState([])

    // Sync cart to database
    const syncCartToDB = async (itemId, action = 'add') => {
        if(!token) return; // Don't sync if user not logged in
        
        try {
            if(action === 'add'){
                await axios.post(`${url}/api/cart/add`, { itemId }, {
                    headers: { token }
                });
            } else if(action === 'remove'){
                await axios.post(`${url}/api/cart/remove`, { itemId }, {
                    headers: { token }
                });
            } else if(action === 'remove-all'){
                await axios.post(`${url}/api/cart/remove-all`, { itemId }, {
                    headers: { token }
                });
            }
        } catch (error) {
            console.error("Error syncing cart to database:", error);
        }
    };

    // Load cart from database
    const loadCartFromDB = async () => {
        if(!token) {
            setCartItems([]);
            return;
        }
        
        try {
            const response = await axios.post(`${url}/api/cart/get`, {}, {
                headers: { token }
            });
            
            if(response.data.success && response.data.cartData){
                // Convert cartData object to array format
                const cartData = response.data.cartData;
                
                // Get current food_list - will be updated in useEffect when it changes
                const currentFoodList = food_list.length > 0 ? food_list : defaultContextValue.food_list;
                
                // Create food map to get full item details
                const foodMap = {};
                if(currentFoodList && currentFoodList.length > 0){
                    currentFoodList.forEach(food => {
                        foodMap[food._id] = food;
                    });
                }
                
                // Convert cartData object to array
                const cartItemsArray = [];
                Object.keys(cartData).forEach(itemId => {
                    const foodItem = foodMap[itemId];
                    if(foodItem){
                        cartItemsArray.push({
                            ...foodItem,
                            quantity: cartData[itemId]
                        });
                    } else {
                        // If food item not found, still add with minimal info to preserve quantity
                        cartItemsArray.push({
                            _id: itemId,
                            quantity: cartData[itemId],
                            name: `Item ${itemId}`,
                            price: 0,
                            description: '',
                            image: ''
                        });
                    }
                });
                
                setCartItems(cartItemsArray);
                console.log("Cart loaded from database:", cartItemsArray);
            } else if(response.data.success && (!response.data.cartData || Object.keys(response.data.cartData).length === 0)){
                // Cart is empty in database
                setCartItems([]);
            }
        } catch (error) {
            console.error("Error loading cart from database:", error);
        }
    };

    const addToCart = async (item) => {
        setCartItems(prev => {
            const found = prev.find(ci => ci._id === item._id);
            if (found) {
                const updated = prev.map(ci => ci._id === item._id ? { ...ci, quantity: (ci.quantity || 1) + 1 } : ci);
                // Sync to database
                syncCartToDB(item._id, 'add');
                return updated;
            }
            const updated = [...prev, { ...item, quantity: 1 }];
            // Sync to database
            syncCartToDB(item._id, 'add');
            return updated;
        });
    };

    const decreaseFromCart = async (itemId) => {
        setCartItems(prev => {
            const found = prev.find(ci => ci._id === itemId);
            if (!found) return prev;
            if ((found.quantity || 1) <= 1) {
                // Sync to database before removing
                syncCartToDB(itemId, 'remove');
                return prev.filter(ci => ci._id !== itemId);
            }
            const updated = prev.map(ci => ci._id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci);
            // Sync to database
            syncCartToDB(itemId, 'remove');
            return updated;
        });
    };
    
    const getTotalCartAmount = () => {
        return cartItems.reduce((sum, item) => {
            const qty = item.quantity || 0;
            const price = item.price || 0;
            return sum + qty * price;
        }, 0);
    };

    const fetchFoodList = async()=>{
        try {
            const response = await axios.get(url+"/api/food/list");
            if(response.data.success && response.data.data && response.data.data.length > 0){
                setFoodList(response.data.data);
            } else {
                console.log("No food items found in database, using default list");
                // Keep empty or use default if no items in database
            }
        } catch (error) {
            console.error("Error fetching food list:", error);
            // On error, keep empty array - will fall back to default from store.js
        }
    }

    useEffect(()=>{
       
        async function loadData(){
            await fetchFoodList();
            if(localStorage.getItem("token")){
                const savedToken = localStorage.getItem("token");
                setToken(savedToken);
            }
        }
        loadData();
    },[])

    // Load cart from database when token changes or food_list loads
    useEffect(()=>{
        if(token){
            // Load cart from database - will retry if food_list updates later
            loadCartFromDB();
        } else {
            // Clear cart if user logs out
            setCartItems([]);
        }
    },[token, food_list])
    
    const removeFromCart = async (itemId) => {
        // Remove item completely from cart
        const item = cartItems.find(ci => ci._id === itemId);
        if(item){
            // Remove all quantities at once from database
            await syncCartToDB(itemId, 'remove-all');
        }
        // Remove from local state
        setCartItems(prev => prev.filter(item => item._id !== itemId));
    };

    const contextValue = {
        ...defaultContextValue,
        cartItems,
        addToCart,
        decreaseFromCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        // Use fetched food_list if available, otherwise fall back to default
        food_list: food_list.length > 0 ? food_list : defaultContextValue.food_list
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;