const db = require( "../libs/docClient" ),
    aws = require( "../libs/aws-utils" ),
    table_name = "twoDaysReady",
    assetType = "family-member";


function saveFamilyMember( data ) {

    data.assetType = assetType;

    return db.saveEntity( data, table_name );

}

function getFamilyMembers( options ) {

    options = options || {};

    options.assetType = assetType;

    for ( let key in options ) {

        if ( key !== "assetType" ) {

            if ( options.hasOwnProperty( key ) ) {

                options.values = [ {
                    "field": key,
                    "value": options[ key ]
                } ];

                options.filters = [ {
                    "field": key,
                    "condition": "=",
                    "value": options[ key ]
                } ];

            }

        }

    }

    return db.createQueryParameters( options )
        .then( params => {

            return db.searchEntity( params, table_name );

        } );

}

function getFamilyMember( id ) {

    if ( !id || id === "" ) {
        return Promise.reject( {
            statusCode: 422,
            campaign: "missing familyMember id"
        } );

    }

    return db.getEntity( {
        assetType: assetType,
        assetId: id
    }, table_name );

}

exports.deleteFamilyMember = function ( data ) {

    getFamilyMember( data.id )
        .then( record => {

            record.active = false;

            return saveFamilyMember( record );

        } );

};

exports.saveFamilyMember = saveFamilyMember;

exports.getFamilyMember = getFamilyMember;

exports.getFamilyMembers = getFamilyMembers;