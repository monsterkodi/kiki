/*
 *  KQuaternion.h
 *  kodisein
 */

#ifndef __KQuaternion
#define __KQuaternion

#include "KVector.h"
#include "KMatrix.h"

#include <float.h>
        
// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------
class KQuaternion
{
    public:

    float w, x, y, z;
        
    KQuaternion ( float _w = 1.0, float _x = 0.0,  float _y = 0.0, float _z = 0.0 )
    {
        w = _w; x = _x; y = _y; z = _z;
    }
    
    KQuaternion ( const KQuaternion & q ) { w = q.w; x = q.x; y = q.y; z = q.z; }
    KQuaternion ( const KVector & v ) { w = 0.0; x = v[X]; y = v[Y]; z = v[Z]; }
    
    static KQuaternion rotationAroundVector ( float theta, const KVector & vector )
    {
        KVector v(vector);
        v.normalize();
        float t = DEG2RAD(theta)/2.0;         
        float s = sin(t);
        return KQuaternion(cos(t), v[X]*s, v[Y]*s, v[Z]*s).normalize();
    }
    
    KVector rotate ( const KVector & v ) const
    {
        KQuaternion result = (*this) * KQuaternion(v) * this->getConjugate();
        return KVector(result.x, result.y, result.z);
    }
                
    KQuaternion & normalize ()
    {
        float l = sqrt(w*w + x*x + y*y + z*z);
        if (l != 0.0) 
        {
            w /= l; x /= l; y /= l; z /= l; 
        }
        return (*this);
    }

    KQuaternion & invert ()
    {
        float l = sqrt(w*w + x*x + y*y + z*z);
        if (l != 0.0) 
        {
            w /= l; x = -x/l; y = -y/l; z = -z/l; 
        }
        return (*this);
    }

    void    		reset  		() 		{ w=1.0; x=y=z=0.0; }
    KQuaternion & 	conjugate	() 		{ x = -x; y = -y; z = -z; return (*this); }
    KQuaternion 	getNormal	() const	{ return KQuaternion(*this).normalize(); }
    KQuaternion 	getConjugate	() const 	{ return KQuaternion(*this).conjugate(); }
    KQuaternion 	getInverse	() const 	{ return KQuaternion(*this).invert(); }
    float		length		() const	{ return sqrt(w*w + x*x + y*y + z*z); }
    void		glRotate	() const	{ KMatrix(*this).glMultMatrix(); }

    KQuaternion 	slerp		( const KQuaternion & quat, float t ) const;

                        operator KVector() const 	{ return KVector(x, y, z); }
    KQuaternion & 	operator += 	( float f )	{ w += f; return(*this); }
    KQuaternion & 	operator -= 	( float f )	{ w -= f; return(*this); }
    KQuaternion & 	operator *= 	( float f )	{ w *= f; x *= f; y *= f; z *= f; return(*this); }
    KQuaternion & 	operator /= 	( float f )	{ w /= f; x /= f; y /= f; z /= f; return(*this); }
        
    KQuaternion & operator += ( const KQuaternion & quat )
    {
        w += quat.w; x += quat.x; y += quat.y; z += quat.z;
        return (*this);
    }
    
    KQuaternion & operator -= ( const KQuaternion & quat )
    {                
        w -= quat.w; x -= quat.x; y -= quat.y; z -= quat.z;
        return (*this);
    }
    
    KQuaternion & operator *= ( const KQuaternion & quat )
    {
        float A, B, C, D, E, F, G, H;
    
        A = (w + x)*(quat.w + quat.x);
        B = (z - y)*(quat.y - quat.z);
        C = (w - x)*(quat.y + quat.z); 
        D = (y + z)*(quat.w - quat.x);
        E = (x + z)*(quat.x + quat.y);
        F = (x - z)*(quat.x - quat.y);
        G = (w + y)*(quat.w - quat.z);
        H = (w - y)*(quat.w + quat.z);
        
        w = B +(-E - F + G + H)/2;
        x = A - (E + F + G + H)/2; 
        y = C + (E - F + G - H)/2; 
        z = D + (E - F - G + H)/2;

        return (*this);
    }

    KQuaternion operator * ( const KQuaternion & quat ) const
    {
        return (KQuaternion(*this) *= quat);
    }    
};        
    
// --------------------------------------------------------------------------------------------------------
inline KQuaternion operator - (const KQuaternion & q)
{
    return KQuaternion(-q.w,-q.x,-q.y,-q.z);
}

// --------------------------------------------------------------------------------------------------------
inline KQuaternion operator * ( float f, const KQuaternion & quat )
{
    KQuaternion result(quat);
    result *= f;
    return result;
}

// --------------------------------------------------------------------------------------------------------
inline bool operator == (const KQuaternion & lquat, const KQuaternion & rquat)
{
    return  ((rquat.w == lquat.w) && (rquat.x == lquat.x) && 
             (rquat.y == lquat.y) && (rquat.z == lquat.z));
}
    
// --------------------------------------------------------------------------------------------------------
inline bool operator != (const KQuaternion & lquat, const KQuaternion & rquat) 
{ 
    return(!(lquat == rquat)); 
} 
            
#endif

