import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSubDetails } from '../../actions/subscription';
import './checkout.css'

const CheckoutPage = () => {
  const user = useSelector(state => state.CurrentUserReducer);
  const subscription = useSelector(state => state.subscriptionReducer);
  const customerId = user?.data?.result?.stripeCustomerId;

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getSubDetails(customerId)) // facing error fix here
  }, [dispatch])


  const plans = [
    {
      id: 1,
      name: 'Free Plan',
      description: 'Can post 1 question per day',
      price: 'Free'
    },
    {
      id: 'price_1OtBvESCzJikMcVlXQEqiBzo',
      name: 'Silver Plan',
      description: 'Can post 5 questions per day',
      price: '99'
    },
    {
      id: 'price_1OtBw6SCzJikMcVllzPQBHOj',
      name: 'Gold Plan',
      description: 'Can post unlimited questions',
      price: '999'
    }
  ];

  const handleFreeTrial = (id) => {
    console.log(id);
  }

  const checkout = async (plan) => {
    const apiKey = process.env.REACT_APP_SECRET_KEY;
    await fetch(`${process.env.REACT_APP_BASE_URL}api/create-subscription-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      mode: "cors",
      body: JSON.stringify({ plan: plan, customerId: user.data.stripeCustomerId }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        console.log(res);
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ session }) => {
        window.location = session.url;
      })
      .catch((e) => {
        console.log(e.error);
      });
  };


  return (
    <>
      {user === null || undefined ? (
        <Navigate to='/Auth' />
      ) :
        <div id="checkout-page">

          <h1 style={{ textAlign: 'center' }}>Select Plan</h1>
          {plans.map(plan => (
            <div className='row' key={plan.id}>
              {subscription[0] === plan.id ? "" : <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '9px', alignContent: 'center' }}> <div>Click me for trial </div>
                <div style={{ textAlign: 'center' }}><input type="radio" name="trial" id="plan.id" /></div>
                <button onClick={handleFreeTrial(plan.id)}>book trial</button>
              </div>}

              <div
                // className='card'
                className={`card ${subscription[0] === plan.id ? 'selected' : ''}`}
              >
                <h2>{plan.name}</h2>
                <p>{plan.description}</p>
                <p>Price: Rs {plan.price}/Month</p>
                {/* {selectedPlan === plan.id && <p>You are subscribed to {plan.name}</p>} */}
                {
                  subscription[0] === plan.id ? "" :
                    <button onClick={() => checkout(plan.id)} type="submit">
                      Pay Now
                    </button>
                }
              </div>
            </div>
          ))}
        </div >
      }
    </>
  );

};

export default CheckoutPage;
