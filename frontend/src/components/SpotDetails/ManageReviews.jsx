import { useEffect } from "react";
import { allReviews } from "../../store/reviews";
import { useDispatch, useSelector } from "react-redux";


function ManageReviews() {

    const dispatch = useDispatch();
    const reviews = useSelector(state => state.reviews)
    console.log(reviews, 'reviews line 10 from Manage')
    useEffect(() => {
        dispatch( allReviews()); 
      }, [dispatch]);


    return (
       <h1>hello</h1>
    )
}


export default ManageReviews;
