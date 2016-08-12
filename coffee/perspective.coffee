# 00000000   00000000  00000000    0000000  00000000   00000000   0000000  000000000  000  000   000  00000000
# 000   000  000       000   000  000       000   000  000       000          000     000  000   000  000     
# 00000000   0000000   0000000    0000000   00000000   0000000   000          000     000   000 000   0000000 
# 000        000       000   000       000  000        000       000          000     000     000     000     
# 000        00000000  000   000  0000000   000        00000000   0000000     000     000      0      00000000

class Perspective
    
    constructor: () ->
        

/*
 *  KPerspectiveProjection.cpp
 *  kodisein
 */

#include "KPerspectiveProjection.h"
#include "KConsole.h"
#include "KXMLTools.h"

#define K_INCLUDE_GLU
#include "KIncludeTools.h"

KDL_CLASS_INTROSPECTION_1 (KPerspectiveProjection, KProjection)

// -------------------------------------------------------------------------------------------------------- 
// -------------------------------------------------------------------------------------------------------- 
KPerspectiveProjection::KPerspectiveProjection ( GLfloat f, GLfloat zn, GLfloat zf ) : KProjection ( zn, zf )
{
    reset ();
    fov = f; 
}

// --------------------------------------------------------------------------------------------------------
KPerspectiveProjection::KPerspectiveProjection ( const KProjection & p ) : KProjection (p)
{
}

// --------------------------------------------------------------------------------------------------------
KProjection * KPerspectiveProjection::copy() const
{
    return new KPerspectiveProjection(*this);
}
 
// -------------------------------------------------------------------------------------------------------- 
void KPerspectiveProjection::rotate ( const GLfloat x, const GLfloat y, const GLfloat z )
{
    KVector savePos = getLookAtPosition();
    translate(-getPosition());
        
    KVector up   = getYVector();
    KVector look = getZVector();

    KMatrix rotxz; rotxz.rotate (x, 0.0, z);
    KMatrix roty;  roty.rotate  (0.0, y, 0.0);

    KVector yunit(0.0, 1.0, 0.0), zunit (0.0, 0.0, 1.0);

    KVector lookperp = look.perpendicular (yunit); // y-axis rotation    
    if (lookperp.length() > 0)
    {
        look = roty * lookperp + look.parallel(yunit);
        up   = roty * up.perpendicular(yunit) + up.parallel(yunit);
    }
    
    // x & z-axis rotation 
    KMatrix transmat(up.cross(look), up, look);
    
    KVector uprotxz   = rotxz * yunit;
    KVector lookrotxz = rotxz * zunit;

    up   = transmat * uprotxz;
    look = transmat * lookrotxz;
    
    *((KMatrix*)this) = KMatrix(up.cross(look), up, look);
    
    setPosition( savePos + eye_distance * getZVector());
}

// --------------------------------------------------------------------------------------------------------
void KPerspectiveProjection::apply ()
{
    glViewport(vp[0], vp[1], vp[2], vp[3]);
    
    gluPerspective (fov, getCurrentAspectRatio(), znear, zfar);

    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    
    KVector lookAt = getLookAtPosition();

    gluLookAt(    matrix[TX], matrix[TY], matrix[TZ],
                lookAt[X], lookAt[Y], lookAt[Z],
                matrix[4], matrix[5], matrix[6]);

    KVector pos = getPosition() + light_offset;
    light.setDirection(-getZVector());
    light.setPosition (KVector(pos[X], pos[Y], pos[Z], 1.0)); // positional light source
    light.initialize  (GL_LIGHT0);
}


// --------------------------------------------------------------------------------------------------------
void KPerspectiveProjection::focusOn ( const KVector & pos )
{
    setPosition (pos + eye_distance*getZVector());
}

// --------------------------------------------------------------------------------------------------------
void KPerspectiveProjection::setEyeDistance ( GLfloat ed )
{
    KVector lookAtPos = getLookAtPosition();
    eye_distance = kMin( kMax(znear, ed), 0.9 * zfar );
    setPosition(lookAtPos + eye_distance * getZVector());
}

// --------------------------------------------------------------------------------------------------------
void KPerspectiveProjection::setLookAtPosition ( const KVector & lookAtPos )
{
    KVector up       = getYVector();
    KVector newLook  = (lookAtPos - getPosition()).normal();
    KVector newRight = up.cross(newLook).normal();
    KVector newUp    = newLook.cross(newRight).normal();

    setXVector(newRight); setYVector(newUp); setZVector(newLook);
    
    eye_distance = (lookAtPos - getPosition()).length(); 
}

// --------------------------------------------------------------------------------------------------------
KVector KPerspectiveProjection::getLookAtPosition () const
{
    return (-eye_distance * getZVector() + getPosition());
}

// -------------------------------------------------------------------------------------------------------- 
void KPerspectiveProjection::reset ()
{
    fov          = 60.0;
    eye_distance = znear;
    KMatrix::reset();
    translate(0.0, 0.0, eye_distance);
}

// -------------------------------------------------------------------------------------------------------- 
KProjection::KProjection ( float zn, float zf ) : KMatrix ()
{
    aspect_ratio = -1.0; 
    znear     = zn; 
    zfar       = zf;
    fov        = 0.0;
    eye_distance = 5.0;
    border[0] = border[1] = border[2] = border[3] = 0;
    setViewport(0.0, 0.0, 1.0, 1.0);
    
    KEventHandler::notification_center.addReceiverCallback
        (this, (KCallbackPtr)&KProjection::updateViewport, KDL_NOTIFICATION_TYPE_VIDEO_MODE_CHANGED);
    KEventHandler::notification_center.addReceiverCallback
        (this, (KCallbackPtr)&KProjection::updateViewport, KDL_NOTIFICATION_TYPE_WINDOW_SIZE_CHANGED);
}

// --------------------------------------------------------------------------------------------------------
KProjection::KProjection ( const KProjection & p ) : KMatrix ( p )
{
    znear      = p.znear; 
    zfar      = p.zfar;
    aspect_ratio = p.aspect_ratio; 
    border[0]      = p.border[0];
    border[1]      = p.border[1];
    border[2]      = p.border[2];
    border[3]      = p.border[3];
    
    fov      = p.fov;
    eye_distance = p.eye_distance;
    
    setViewport(p.viewport[0], p.viewport[1], p.viewport[2], p.viewport[3]);
}

// --------------------------------------------------------------------------------------------------------
void KProjection::initProjection ()
{
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    apply();
}

// --------------------------------------------------------------------------------------------------------
void KProjection::updateViewport ()
{
    KSize screenSize = KEventHandler::getScreenSize();
    
    vp[0] = (int)(viewport[0] * (float)screenSize.w + (int)border[0]);
    vp[1] = (int)(viewport[1] * (float)screenSize.h + (int)border[1]); 
    vp[2] = (int)(viewport[2] * (float)screenSize.w - (int)(border[0]+border[2]));
    vp[3] = (int)(viewport[3] * (float)screenSize.h - (int)(border[1]+border[3]));
}

// --------------------------------------------------------------------------------------------------------
/* returns the position of the locator in "viewport coordinates"
*/
KPosition KProjection::getLocatorViewportPos () const
{
    return (KEventHandler::getMousePos() - getViewportScreenPos());
}

// --------------------------------------------------------------------------------------------------------
float KProjection::getCurrentAspectRatio () const
{
    KSize viewportSize = getViewportSize();
    return (aspect_ratio <= 0.0) ? ((float)viewportSize.w/viewportSize.h) : aspect_ratio;
}

// --------------------------------------------------------------------------------------------------------
void KProjection::getSaveMatrices (GLdouble * model, GLdouble * proj, GLint * view)
{
    glMatrixMode(GL_MODELVIEW); 
    glPushMatrix();
    glMatrixMode(GL_PROJECTION); 
    glPushMatrix(); 
    initProjection(); 
    glGetDoublev(GL_PROJECTION_MATRIX, proj); 
    glGetDoublev(GL_MODELVIEW_MATRIX, model);
    glGetIntegerv(GL_VIEWPORT, (GLint*)view);
    glMatrixMode(GL_PROJECTION); 
    glPopMatrix(); 
    glMatrixMode(GL_MODELVIEW); 
    glPopMatrix();
}

// --------------------------------------------------------------------------------------------------------
void KProjection::getXYValuesForScreenDeltasAndMatrix 
                                            (float dx, float dy, const KMatrix & cm, float * x, float * y )
{    
    KMatrix m(cm);
    GLdouble dxpox, dxpoy, dypox, dypoy, ox, oy, xpox, xpoy, ypox, ypoy, tz, model[16], proj[16];
    GLint view[4]; getSaveMatrices(model, proj, view);
    
    GLdouble screenUnits, xx, xy, yx, yy, zx, zy;
    gluProject(m[TX], m[TY], m[TZ],       model, proj, view, &ox, &oy, &tz);
    gluProject(m[TX] + 1.0, m[TY], m[TZ], model, proj, view, &xx, &xy, &tz);
    gluProject(m[TX], m[TY] + 1.0, m[TZ], model, proj, view, &yx, &yy, &tz);
    gluProject(m[TX], m[TY], m[TZ] + 1.0, model, proj, view, &zx, &zy, &tz);
    screenUnits=(kMax(kMax(kAbs(xx-ox)+kAbs(xy-oy),kAbs(yx-ox)+kAbs(yy-oy)),kAbs(zx-ox)+kAbs(zy-oy)));
    
    gluProject(m[TX], m[TY], m[TZ], model, proj, view, &ox, &oy, &tz);
    KMatrix r(m); r.translate(1.0, 0.0, 0.0);
    gluProject(r[TX], r[TY], r[TZ], model, proj, view, &xpox, &xpoy, &tz);
    m.translate(0.0, 1.0, 0.0);
    gluProject(m[TX], m[TY], m[TZ], model, proj, view, &ypox, &ypoy, &tz);
    dxpox = xpox - ox; dxpoy = xpoy - oy; dypox = ypox - ox; dypoy = ypoy - oy;
    
    if (kAbs(dxpox) >= kAbs(dypox)) // x-axis differnce in x-direction is bigger -> map x movement to x
    {
        if (dxpox >= 0) *x = dx/screenUnits; // positive movement in x direction
        else *x = -dx/screenUnits;           // negative movement in x direction
        if (dypoy >= 0) *y = dy/screenUnits; // positive movement in y direction
        else *y = -dy/screenUnits;           // negative movement in y direction
    }
    else // x-axis differnce in y-direction is bigger -> map x movement to y
    {
        if (dypox >= 0) *y = dx/screenUnits; // positive movement in x direction
        else *y = -dx/screenUnits;           // negative movement in x direction
        if (dxpoy >= 0) *x = dy/screenUnits; // positive movement in y direction
        else *x = -dy/screenUnits;           // negative movement in y direction
    }
}

// --------------------------------------------------------------------------------------------------------
void KProjection::getXZValuesForScreenDeltasAndMatrix 
                                            ( float dx, float dy, const KMatrix & cm, float * x, float * z )
{    
    KMatrix m(cm);
    GLdouble dxpox, dxpoy, dypox, dypoy, ox, oy, xpox, xpoy, ypox, ypoy, tz, model[16], proj[16];
    GLint view[4]; getSaveMatrices(model, proj, view);
    
    GLdouble screenUnits, xx, xy, yx, yy, zx, zy;
    gluProject(m[TX], m[TY], m[TZ],       model, proj, view, &ox, &oy, &tz);
    gluProject(m[TX] + 1.0, m[TY], m[TZ], model, proj, view, &xx, &xy, &tz);
    gluProject(m[TX], m[TY] + 1.0, m[TZ], model, proj, view, &yx, &yy, &tz);
    gluProject(m[TX], m[TY], m[TZ] + 1.0, model, proj, view, &zx, &zy, &tz);
    screenUnits=(kMax(kMax(kAbs(xx-ox)+kAbs(xy-oy),kAbs(yx-ox)+kAbs(yy-oy)),kAbs(zx-ox)+kAbs(zy-oy)));
    
    gluProject(m[TX], m[TY], m[TZ], model, proj, view, &ox, &oy, &tz);
    KMatrix r(m); r.translate(1.0, 0.0, 0.0);
    gluProject(r[TX], r[TY], r[TZ], model, proj, view, &xpox, &xpoy, &tz);
    m.translate(0.0, 0.0, 1.0);
    gluProject(m[TX], m[TY], m[TZ], model, proj, view, &ypox, &ypoy, &tz);
    dxpox = xpox - ox; dxpoy = xpoy - oy; dypox = ypox - ox; dypoy = ypoy - oy;
    
    if (kAbs(dxpox) >= kAbs(dypox)) // x-axis differnce in x-direction is bigger -> map x movement to x
    {
        if (dxpox >= 0) *x = dx/screenUnits; // positive movement in x direction
        else *x = -dx/screenUnits;           // negative movement in x direction
        if (dypoy >= 0) *z = dy/screenUnits; // positive movement in y direction
        else *z = -dy/screenUnits;           // negative movement in y direction
    }
    else // x-axis differnce in y-direction is bigger -> map x movement to y
    {
        if (dypox >= 0) *z = dx/screenUnits; // positive movement in x direction
        else *z = -dx/screenUnits;           // negative movement in x direction
        if (dxpoy >= 0) *x = dy/screenUnits; // positive movement in y direction
        else *x = -dy/screenUnits;           // negative movement in y direction
    }
}

// --------------------------------------------------------------------------------------------------------
void KProjection::getYZValuesForScreenDeltasAndMatrix 
                                    ( float dx, const float dy, const KMatrix & cm, float * y, float * z )
{    
    KMatrix m(cm);
    GLdouble dxpox, dxpoy, dypox, dypoy, ox, oy, xpox, xpoy, ypox, ypoy, tz, model[16], proj[16];
    GLint view[4]; getSaveMatrices(model, proj, view);
    
    GLdouble screenUnits, xx, xy, yx, yy, zx, zy;
    gluProject(m[TX], m[TY], m[TZ],       model, proj, view, &ox, &oy, &tz);
    gluProject(m[TX] + 1.0, m[TY], m[TZ], model, proj, view, &xx, &xy, &tz);
    gluProject(m[TX], m[TY] + 1.0, m[TZ], model, proj, view, &yx, &yy, &tz);
    gluProject(m[TX], m[TY], m[TZ] + 1.0, model, proj, view, &zx, &zy, &tz);
    screenUnits=(kMax(kMax(kAbs(xx-ox)+kAbs(xy-oy),kAbs(yx-ox)+kAbs(yy-oy)),kAbs(zx-ox)+kAbs(zy-oy)));
    
    gluProject(m[TX], m[TY], m[TZ], model, proj, view, &ox, &oy, &tz);
    KMatrix r(m); r.translate(0.0, 1.0, 0.0);
    gluProject(r[TX], r[TY], r[TZ], model, proj, view, &xpox, &xpoy, &tz);
    m.translate(0.0, 0.0, 1.0);
    gluProject(m[TX], m[TY], m[TZ], model, proj, view, &ypox, &ypoy, &tz);
    dxpox = xpox - ox; dxpoy = xpoy - oy; dypox = ypox - ox; dypoy = ypoy - oy;
    
    if (kAbs(dxpox) >= kAbs(dypox)) // x-axis differnce in x-direction is bigger -> map x movement to x
    {
        if (dxpox >= 0) *y = dx/screenUnits; // positive movement in x direction
        else *y = -dx/screenUnits;           // negative movement in x direction
        if (dypoy >= 0) *z = dy/screenUnits; // positive movement in y direction
        else *z = -dy/screenUnits;           // negative movement in y direction
    }
    else // x-axis differnce in y-direction is bigger -> map x movement to y
    {
        if (dypox >= 0) *z = dx/screenUnits; // positive movement in x direction
        else *z = -dx/screenUnits;           // negative movement in x direction
        if (dxpoy >= 0) *y = dy/screenUnits; // positive movement in y direction
        else *y = -dy/screenUnits;           // negative movement in y direction
    }
}

// --------------------------------------------------------------------------------------------------------
float KProjection::getXValueForScreenDeltasAndMatrix (float dx, float dy, const KMatrix & cm)
{    
    KMatrix m(cm);
    GLdouble maxDelta, dox, doy, ox, oy, oxpo, oypo, z, model[16], proj[16];
    GLint view[4]; getSaveMatrices(model, proj, view);
    
    GLdouble screenUnits, xx, xy, yx, yy, zx, zy;
    GLdouble mx = m[TX], my = m[TY], mz = m[TZ];
    gluProject(mx, my, mz,      model, proj, view, &ox, &oy, &z);
    gluProject(mx + 1.0, my, mz, model, proj, view, &xx, &xy, &z);
    gluProject(mx, my + 1.0, mz, model, proj, view, &yx, &yy, &z);
    gluProject(mx, my, mz + 1.0, model, proj, view, &zx, &zy, &z);
    screenUnits=(kMax(kMax(kAbs(xx-ox)+kAbs(xy-oy),kAbs(yx-ox)+kAbs(yy-oy)),kAbs(zx-ox)+kAbs(zy-oy)));
    
    gluProject(mx, my, mz, model, proj, view, &ox, &oy, &z);
    m.translate(1.0, 0.0, 0.0);
    gluProject(m[TX], m[TY], m[TZ], model, proj, view, &oxpo, &oypo, &z);
    
    dox = oxpo - ox; doy = oypo - oy;
    
    if        (dox >= 0 && doy >= 0) maxDelta = kAbsMax(dx, dy);      // upper right - keep directions
    else if (dox <= 0 && doy <= 0) maxDelta = -kAbsMax(dx, dy);     // lower left - invert both
    else if (dox < 0) maxDelta = (kAbs(dx) > kAbs(dy)) ? -dx : dy; // upper left - invert x
    else              maxDelta = (kAbs(dx) > kAbs(dy)) ? dx : -dy; // lower right - invert y

    return (maxDelta/screenUnits);
}

// --------------------------------------------------------------------------------------------------------
float KProjection::getYValueForScreenDeltasAndMatrix ( float dx, float dy, const KMatrix & cm)
{
    KMatrix m(cm);
    GLdouble maxDelta, dox, doy, ox, oy, oxpo, oypo, z, model[16], proj[16];
    GLint view[4]; getSaveMatrices(model, proj, view);
    
    GLdouble screenUnits, xx, xy, yx, yy, zx, zy;
    GLdouble mx = m[TX], my = m[TY], mz = m[TZ];
    gluProject(mx, my, mz,      model, proj, view, &ox, &oy, &z);
    gluProject(mx + 1.0, my, mz, model, proj, view, &xx, &xy, &z);
    gluProject(mx, my + 1.0, mz, model, proj, view, &yx, &yy, &z);
    gluProject(mx, my, mz + 1.0, model, proj, view, &zx, &zy, &z);
    screenUnits=(kMax(kMax(kAbs(xx-ox)+kAbs(xy-oy),kAbs(yx-ox)+kAbs(yy-oy)),kAbs(zx-ox)+kAbs(zy-oy)));
    
    gluProject(mx, my, mz, model, proj, view, &ox, &oy, &z);
    m.translate(0.0, 1.0, 0.0);
    gluProject(m[TX], m[TY], m[TZ], model, proj, view, &oxpo, &oypo, &z);
    
    dox = oxpo - ox; doy = oypo - oy;
    
    if        (dox >= 0 && doy >= 0) maxDelta = kAbsMax(dx, dy);      // upper right - keep directions
    else if (dox <= 0 && doy <= 0) maxDelta = -kAbsMax(dx, dy);     // lower left - invert both
    else if (dox < 0) maxDelta = (kAbs(dx) > kAbs(dy)) ? -dx : dy; // upper left - invert x
    else              maxDelta = (kAbs(dx) > kAbs(dy)) ? dx : -dy; // lower right - invert y

    return (maxDelta/screenUnits);
}

// --------------------------------------------------------------------------------------------------------
float KProjection::getZValueForScreenDeltasAndMatrix ( float dx, float dy, const KMatrix & cm)
{
    KMatrix m(cm);
    GLdouble maxDelta, dox, doy, ox, oy, oxpo, oypo, z, model[16], proj[16];
    GLint view[4]; getSaveMatrices(model, proj, view);
    
    GLdouble screenUnits, xx, xy, yx, yy, zx, zy;
    GLdouble mx = m[TX], my = m[TY], mz = m[TZ];
    gluProject(mx, my, mz,      model, proj, view, &ox, &oy, &z);
    gluProject(mx + 1.0, my, mz, model, proj, view, &xx, &xy, &z);
    gluProject(mx, my + 1.0, mz, model, proj, view, &yx, &yy, &z);
    gluProject(mx, my, mz + 1.0, model, proj, view, &zx, &zy, &z);
    screenUnits=(kMax(kMax(kAbs(xx-ox)+kAbs(xy-oy),kAbs(yx-ox)+kAbs(yy-oy)),kAbs(zx-ox)+kAbs(zy-oy)));
    
    gluProject(mx, my, mz, model, proj, view, &ox, &oy, &z);
    m.translate(0.0, 0.0, 1.0);
    gluProject(m[TX], m[TY], m[TZ], model, proj, view, &oxpo, &oypo, &z);
    
    dox = oxpo - ox; doy = oypo - oy;
    
    if        (dox >= 0 && doy >= 0) maxDelta = kAbsMax(dx, dy);      // upper right - keep directions
    else if (dox <= 0 && doy <= 0) maxDelta = -kAbsMax(dx, dy);     // lower left - invert both
    else if (dox < 0) maxDelta = (kAbs(dx) > kAbs(dy)) ? -dx : dy; // upper left - invert x
    else              maxDelta = (kAbs(dx) > kAbs(dy)) ? dx : -dy; // lower right - invert y

    return (maxDelta/screenUnits);
}

// --------------------------------------------------------------------------------------------------------
bool KProjection::getScreenCoordinates ( const KVector & pos, double * sx, double * sy)
{
    GLdouble sz, model[16], proj[16]; GLint view[4];
    getSaveMatrices (model, proj, view);
    
    if (gluProject(pos[X], pos[Y], pos[Z], model, proj, view, sx, sy, &sz))
    {
        return true;
    }
    else
    {
        KConsole::printError("unable to calculate projection screen coordinates!");
        return false;
    }
}

// --------------------------------------------------------------------------------------------------------
bool KProjection::moveObjectRelativeToWindow ( const KPosition & delta, KVector & pos )
{
    GLdouble wx, wy, wz, model[16], proj[16]; GLint view[4];
    getSaveMatrices (model, proj, view);

    if (gluProject(pos[X], pos[Y], pos[Z], model, proj, view, &wx, &wy, &wz))
    {
        GLdouble ox, oy, oz;
        
        if (gluUnProject(wx+delta.x, wy+delta.y, wz, model, proj, view, &ox, &oy, &oz) == false)
        {
            return false;
        }
        pos = KVector(ox, oy, oz);
    }
    else
    {
        return false;
    }
    
    return true;
}

// --------------------------------------------------------------------------------------------------------
void KProjection::setViewportBorder ( unsigned int l, unsigned int b, unsigned int r, unsigned int t )
{
    border[0] = l; border[1] = b; border[2] = r;  border[3] = t;
    updateViewport();
}

// --------------------------------------------------------------------------------------------------------
void KProjection::setViewport ( float l, float b, float w, float h )
{
    viewport[0] = l; viewport[1] = b; viewport[2] = w;  viewport[3] = h;
    updateViewport();
}

// --------------------------------------------------------------------------------------------------------
void KProjection::setFov ( float f )
{
    fov = kMax(2.0, kMin(f, 175.0));
}

// --------------------------------------------------------------------------------------------------------
void KProjection::setEyeDistance ( float ed )
{
    eye_distance = kMin( kMax(znear, ed), 0.9 * zfar );
}




        
module.exports = Perspective
