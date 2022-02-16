import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap'
import {
    LoadScript,
    GoogleMap,
    StandaloneSearchBox,
    Marker,
} from '@react-google-maps/api';
import LoadingBox from '../components/Loader';
import Axios from 'axios';
import { USER_ADDRESS_MAP_CONFIRM } from '../constants/userConstants';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const libs = ['places'];
const defaultLocation = { lat: 35.7002, lng: 51.3379 };

export default function MapScreen() {
    const navigate = useNavigate();
    const [googleApiKey, setGoogleApiKey] = useState('');
    const [center, setCenter] = useState(defaultLocation);
    const [location, setLocation] = useState(center);

    const mapRef = useRef(null);
    const placeRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await Axios('/api/config/google');
            setGoogleApiKey(data);
            getUserCurrentLocation();
        };
        fetch();
    }, []);

    const onLoad = (map) => {
        mapRef.current = map;
    };

    const onMarkerLoad = (marker) => {
        markerRef.current = marker;
    };
    const onLoadPlaces = (place) => {
        placeRef.current = place;
    };
    const onIdle = () => {
        setLocation({
            lat: mapRef.current.center.lat(),
            lng: mapRef.current.center.lng(),
        });
    };
    const onPlacesChanged = () => {
        const place = placeRef.current.getPlaces()[0].geometry.location;
        setCenter({ lat: place.lat(), lng: place.lng() });
        setLocation({ lat: place.lat(), lng: place.lng() });
    };
    const dispatch = useDispatch();
    const onConfirm = () => {
        toast.dismiss()
        const places = placeRef.current.getPlaces();
        if (places && places.length === 1) {
            // dispatch select action
            dispatch({
                type: USER_ADDRESS_MAP_CONFIRM,
                payload: {
                    lat: location.lat,
                    lng: location.lng,
                    address: places[0].formatted_address,
                    name: places[0].name,
                    vicinity: places[0].vicinity,
                    googleAddressId: places[0].id,
                },
            });
            toast.success('location selected successfully.');
            navigate('/shipping');
        } else {
            toast.error('Please enter your address');
        }
    };

    const getUserCurrentLocation = () => {
        toast.dismiss()
        if (!navigator.geolocation) {
            toast.error('Geolocation os not supported by this browser');
        } else {
            navigator.geolocation.getCurrentPosition((position) => {
                setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        }
    };

    return googleApiKey ? (
        <>
            <Toaster
                toastOptions={{
                    duration: 4000,
                }}
            />
            <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
                <GoogleMap
                    id="smaple-map"
                    // mapContainerStyle={{ height: '100%', width: '100%' }}
                    mapContainerStyle={{ height: '80vh', width: '100%' }}
                    center={center}
                    zoom={15}
                    onLoad={onLoad}
                    onIdle={onIdle}
                >
                    <StandaloneSearchBox
                        onLoad={onLoadPlaces}
                        onPlacesChanged={onPlacesChanged}
                    >
                        <Form className="d-flex justify-content-center" onClick={onConfirm}>
                            <Form.Control
                                type='text'
                                name='q'
                                placeholder='Enter your address'
                                className='mr-sm-2 ml-sm-5 rounded-0 rounded-start'
                                style={{ height: '2.2rem', marginTop: 'auto' }}
                            ></Form.Control>
                            <Button type='submit' variant='warning' size="sm" className="rounded-0 rounded-end">
                                <FontAwesomeIcon icon={faSearch} className="text-dark" />
                            </Button>
                        </Form>
                    </StandaloneSearchBox>
                    <Marker position={location} onLoad={onMarkerLoad}></Marker>
                </GoogleMap>
            </LoadScript>
        </>
    ) : (
            <LoadingBox></LoadingBox>
        );
}
