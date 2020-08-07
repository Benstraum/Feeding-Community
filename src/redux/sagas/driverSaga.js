import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* driverSaga() {
    yield takeEvery('GET_DRIVER_DEPENDENTS', getDriverDependents)
    // yield takeEvery('GET_ROUTES', getRoutes)
}

//gets information for driver dependents
function* getDriverDependents() {
    try {
        const responsePayload = yield axios.get(`/api/driver`);
        console.log(responsePayload)
        yield put({ type: 'SET_DRIVER_DEPENDENTS' , payload: responsePayload});
    } catch (error) {
        console.log('error with GET driver saga', error);
    }
}

// function* getRoutes() {
//     try {
//         const responsePayload = yield axios.get(`/api/driver/routes`);
//         yield put({ type: 'SET_ROUTES' , payload: responsePayload});
//     } catch (error) {
//         console.log('error with GET routes saga', error);
//     }
// }

export default driverSaga;
// //retrieves all dependents information
// function* getRouteDependents(action) {
//     try {
//         const responsePayload = yield axios.get(`/api/driver/${action.payload.id}`);
//         yield put({ type: 'SET_ROTUE_DEPENDENTS' , payload: responsePayload});
//     } catch (error) {
//         console.log('Get all saga error', error);
//     }
// }


// function* dependentSaga() {
//     yield takeEvery('GET_ROUTE_DEPENDENTS', getRouteDependents);
// }

// export default dependentSaga;
