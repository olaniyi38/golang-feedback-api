import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { likeFeedback } from "../feedbacks/feedbacksSlice";
import { toast } from "react-toastify";

const fetchUser = createAsyncThunk("user/getUser", async () => {
    const res = await fetch("http://localhost:3000/fetch-user", {
        credentials: "include"
    })
    if (res.status === 200) {
        const user = await res.json()
        return user
    }
    throw new Error("you are " + res.statusText.toLowerCase() + " to access ")
})

const signUpUser = createAsyncThunk("user/sign-up", async (user) => {
    const res = await fetch("http://localhost:3000/auth/sign-up", {
        method: "POST",
        body: JSON.stringify(user),
        credentials: "include"

    }).catch((err) => { throw new Error(err) })

    if (res.status === 200) {
        const user = await res.json()
        return user
    }
    const error = await res.json()

    throw new Error(error.message)

})

const signInUser = createAsyncThunk("user/sign-in", async (userCred) => {
    const res = await fetch("http://localhost:3000/auth/sign-in", {
        method: "POST",
        body: JSON.stringify(userCred),
        credentials: "include"
    }).catch((err) => { throw new Error(err) })

    if (res.status > 200 && res.status < 299) {
        const user = await res.json()

        return user
    }
    const error = await res.json()
    throw new Error(error.message)

})

const logOutUser = createAsyncThunk("user/logout", async () => {
    const res = await fetch("http://localhost:3000/auth/logout", {
        credentials: "include"
    })
    if (res.status === 200) {
        return
    }
    throw new Error("error logging out")
})



const userSlice = createSlice({
    name: "currentUser",
    initialState: {
        user: null,
        status: "pending"
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state, action) => {
            state.status = "pending"
        }).addCase(fetchUser.fulfilled, (state, action) => {
            state.user = action.payload
            state.status = "success"
        }).addCase(fetchUser.rejected, (state, action) => {
            console.log(action.error)
            state.status = "failed"
        }).addCase(signUpUser.pending, (state, action) => {
            state.status = "pending"
        }).addCase(signUpUser.fulfilled, (state, action) => {
            state.status = "success"
            state.user = {
                ...action.payload, likes: [],
                image: "https://github.com/SirDev97/product-feedback-app/blob/main/public/assets/user-images/image-suzanne.jpg?raw=truehttps://github.com/SirDev97/product-feedback-app/blob/main/public/assets/user-images/image-suzanne.jpg?raw=true"
            }
        }).addCase(signUpUser.rejected, (state, action) => {
            state.status = "failed"
            toast.error(action.error.message)
        }).addCase(signInUser.pending, (state, action) => {
            state.status = "pending"
        }).addCase(signInUser.fulfilled, (state, action) => {
            state.status = "success"
            state.user = action.payload
        }).addCase(signInUser.rejected, (state, action) => {
            state.status = "failed"
            toast.error(action.error.message)
        }).addCase(likeFeedback.fulfilled, (state, action) => {
            const { newLikes } = action.payload
            state.user.likes = newLikes
        }).addCase(likeFeedback.rejected, (state, action) => {
            console.log(action.error)
            state.status = "failed"

        }).addCase(logOutUser.pending, (state, action) => {
            state.status = "pending"
        }).addCase(logOutUser.fulfilled, (state, error) => {
            state.user = null
            toast.success("Logged out")
            state.status = "success"
        }).addCase(logOutUser.rejected, (state, action) => {
            toast.error("error logging out: " + action.error.message)
        })
    }
})


export { fetchUser, signInUser, signUpUser, logOutUser }


export default userSlice.reducer


