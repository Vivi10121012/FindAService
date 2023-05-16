import React from 'react';
import './tokyo.css'

const Item = (title, line1, line2, turl = '', lurl = '') => {
  return (
    <>
      <li>
        <strong>
          <a href={turl}>{title}</a>
        </strong>
        <ul className="tabtab">
          <li>{lurl ? <a href={lurl}>{line1}</a> : line1}</li>
          <li>{line2}</li>
        </ul>
      </li>
    </>
  );
};

const HomePageAbout = () => {
  return (
    <>
      <div className="tokyo_tm_about">
        <div className="description">
          <h3 className="name">About US</h3>
          <div className="description_inner">
            <div className="left">
              <div className="category">
                <h4>SERVICES</h4>
                <ul className="tab">
                  {Item(
                    'CLEANING',
                    'Immaculate cleanliness at your fingertips.',
                    'Trustworthy cleaning service for a spotless environment.'
                  )}
                  {Item(
                    'BANYSITTING',
                    "Reliable babysitting service for your peace of mind.",
                    "Experienced caregivers ensuring your children's safety and happiness."
                  )}
                  {Item(
                    'PEST CONTROL',
                    'Effective pest control solutions for a pest-free environment.',
                    'Say goodbye to unwanted intruders with our reliable pest control service.'
                  )}
                  {Item(
                    'PLUMPING',
                    'Reliable plumbing solutions for all your plumbing needs.',
                    'Trust our skilled plumbers to fix and maintain your plumbing system with expertise.'
                  )}
                  {Item(
                    'ELECTRICAL REPAIRS',
                    'Expert electrical repair services to keep your electrical systems running smoothly.',
                    'Trust our skilled technicians to handle all your electrical repair needs.'
                  )}
                  {Item(
                    'ELECTRICAL REPAIRS',
                    'Indulge in the art of beauty and enhance your natural radiance.',
                    'Experience top-notch beauty services tailored to your needs.'
                  )}
                </ul>
              </div>
              <div className="category">
              <h4>JOIN US</h4>
                <ul className="tab">
                  {Item(
                    'SERVICE PROVIDER',
                    'Join our platform as a service provider and expand your business reach.',
                    'Connect with a diverse customer base and showcase your exceptional services.'
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePageAbout;