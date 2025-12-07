import { Prisma } from '@prisma/client';
import { DMMF } from '@prisma/client/runtime/library';
import { parseQueryParams } from '../../src/utils/paginate-helpers';
import { MockContext, mockPrisma } from '../mocks/prismaClient.mock';

function parseUrlQuery(url: string): Record<string, string> {
    const queryString = url.split('?')[1] || '';
    return Object.fromEntries(new URLSearchParams(queryString).entries());
};

function getMockDmmf(): DMMF.Datamodel {
    return {
        indexes: [],
        types: [],
        models: [
            {
                name: 'Product',
                dbName: null,
                schema: null,
                uniqueFields: [],
                uniqueIndexes: [],
                primaryKey: { fields: ['id'], name: '' },
                fields: [
                    { name: 'id', type: 'Int', isId: true, kind: "scalar", isRequired: true, isList: false, isUnique: true, isReadOnly: true, hasDefaultValue: false },
                    { name: 'name', type: 'String', isId: false, kind: "scalar", isRequired: true, isList: false, isUnique: true, isReadOnly: true, hasDefaultValue: false },
                    { name: 'price', type: 'Float', isId: false, kind: "scalar", isRequired: true, isList: false, isUnique: false, isReadOnly: true, hasDefaultValue: false },
                    { name: 'status', type: 'ProductStatus', isId: false, kind: "enum", isRequired: true, isList: false, isUnique: false, isReadOnly: true, hasDefaultValue: false },
                    { name: 'shop', type: 'shopType', isId: false, kind: "enum", isRequired: true, isList: false, isUnique: false, isReadOnly: true, hasDefaultValue: false },
                    { name: 'isAvailable', type: 'Boolean', isId: false, kind: "scalar", isRequired: false, isList: false, isUnique: false, isReadOnly: true, hasDefaultValue: false },
                    {
                        name: 'createdAt',
                        kind: 'scalar',
                        isRequired: false,
                        isList: false,
                        isUnique: false,
                        isId: false,
                        isReadOnly: false,
                        isGenerated: false,
                        isUpdatedAt: false,
                        type: 'DateTime',
                        hasDefaultValue: false,
                    },
                    {
                        name: 'updatedAt',
                        kind: 'scalar',
                        isRequired: false,
                        isList: false,
                        isUnique: false,
                        isId: false,
                        isReadOnly: false,
                        isGenerated: false,
                        isUpdatedAt: false,
                        type: 'DateTime',
                        hasDefaultValue: false,
                    },
                    //             {
                    //               name: 'related',
                    //               kind: 'object',
                    //               isRequired: false,
                    //               isList: false,
                    //               isUnique: false,
                    //               isId: false,
                    //               isReadOnly: false,
                    //               isGenerated: false,
                    //               isUpdatedAt: false,
                    //               type: 'MockModel',
                    //               hasDefaultValue: false,
                    //               default: null,
                    //               documentation: null,
                    //               relationName: 'MockModelRelation',
                    //               relationFromFields: ['relatedId'],
                    //               relationToFields: ['id'],
                    //               isCreatedAt: false,
                    //             }
                ]
            }
        ],
        enums: [
            {
                name: 'ProductStatus',
                values: [{ name: 'ACTIVE', dbName: null }, { name: 'INACTIVE', dbName: null }]
            },
            {
                name: 'shopType',
                values: [{ name: 'SHOP-1', dbName: null }, { name: 'SHOP-2', dbName: null }]
            }
        ]
    };
}


// Mock the entire Prisma client
jest.mock('@prisma/client', () => ({
    Prisma: {
        dmmf: {
            datamodel: getMockDmmf()
        }
    }
}));

describe("Prisma Filter Helper: paginate-helpers", () => {

    const allowedFilters: (keyof Prisma.RoomWhereInput)[] = ['mainType', 'roomNumber', 'roomType', 'status'];

    describe("Filter Field Validation", () => {
        const allowedFilters = ['price', 'name'];
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("throws an error when filtering by a disallowed field", () => {
            const urlPath: string = "/rooms?notAllowedField[INVALID]=12";
            const queryObj = parseUrlQuery(urlPath);

            expect(() => parseQueryParams(
                queryObj, allowedFilters, 'Product'
            )).toThrow("Filtering by 'notAllowedField' is not allowed. Allowed filters: price, name");
        });
    });

    describe('String parameter Handling', () => {
        let mockCtx: MockContext;
        const allowedFilters = ['name'];

        beforeEach(() => {
            mockCtx = mockPrisma as unknown as MockContext;
            jest.clearAllMocks();
        });

        //TODO: Write tests for all of remaining operators

        it("throws for invalid string operator", () => {
            const urlPath: string = "/rooms?name[gte]=12";
            const queryObj = parseUrlQuery(urlPath);

            expect(() => parseQueryParams(
                queryObj, allowedFilters, 'Product'
            )).toThrow("Invalid operator 'gte' for field 'name'. Valid operators: equals, contains, startsWith, endsWith, in, notIn, not");
        });

        it("should return a object with the defined operator as a key and parsed value as a string", () => {
            const urlPath: string = "/rooms?name[equals]=50"
            const queryObj = parseUrlQuery(urlPath);

            const { filters, pagination } = parseQueryParams(
                queryObj, allowedFilters, 'Product'
            );

            expect(filters).toEqual({
                name: { equals: "50", mode: 'insensitive' }
            })
        });

        it("should return object with 'equals' as a key and passed string as the value", () => {
            const urlPath: string = "/rooms?name[equals]=john"
            const queryObj = parseUrlQuery(urlPath);

            const { filters, pagination } = parseQueryParams(
                queryObj, allowedFilters, 'Product'
            );

            expect(filters).toEqual({
                name: { equals: "john", mode: 'insensitive' }
            })
        });

        it("should return object with 'contains' as a key and passed string as the value", () => {
            const urlPath: string = "/rooms?name[contains]=john"
            const queryObj = parseUrlQuery(urlPath);

            const { filters, pagination } = parseQueryParams(
                queryObj, allowedFilters, 'Product'
            );

            expect(filters).toEqual({
                name: { contains: "john", mode: 'insensitive' }
            })
        });

        it("should return object with 'not' as a key and passed string as the value", () => {
            const urlPath: string = "/rooms?name[not]=john"
            const queryObj = parseUrlQuery(urlPath);

            const { filters, pagination } = parseQueryParams(
                queryObj, allowedFilters, 'Product'
            );

            expect(filters).toEqual({
                name: { not: "john", mode: 'insensitive' }
            })
        });

        it("should return object with 'in' as the key and string array as value for comma separated strings", () => {
            const urlPath: string = "/rooms?name[in]=john,doe"
            const queryObj = parseUrlQuery(urlPath);

            const { filters, pagination } = parseQueryParams(
                queryObj, allowedFilters, 'Product'
            );

            expect(filters).toEqual({
                name: { in: ["john", "doe"], mode: 'insensitive' }
            })
        });

        it("should return object with 'in' as the key and string array as value for comma separated strings and mode as 'insensitive' if the relevant query has the '__casesensitive'", () => {
            const urlPath: string = "/rooms?name[in]__exact=john,doe"
            const queryObj = parseUrlQuery(urlPath);

            const { filters, pagination } = parseQueryParams(
                queryObj, allowedFilters, 'Product'
            );

            expect(filters).toEqual({
                name: { in: ["john", "doe"], mode: 'default' }
            })
        });
    })

    describe('Boolean parameter Handling', () => {
        let mockCtx: MockContext;
        const allowedFilters = ['isAvailable'];

        beforeEach(() => {
            mockCtx = mockPrisma as unknown as MockContext;
            jest.clearAllMocks();
        });

        it("throws for invalid boolean operator", () => {
            const urlPath: string = "/rooms?isAvailable[INVALID]=12";
            const queryObj = parseUrlQuery(urlPath);

            expect(() => parseQueryParams(
                queryObj, allowedFilters, 'Product'
            )).toThrow("Invalid operator 'INVALID' for field 'isAvailable'. Valid operators: equals");
        });

        it("throws for invalid boolean values", () => {
            const urlPath: string = "/rooms?isAvailable=not-boolean-value";
            const queryObj = parseUrlQuery(urlPath);

            expect(() => parseQueryParams(
                queryObj, allowedFilters, 'Product'
            )).toThrow("Invalid boolean value not-boolean-value for field 'isAvailable'. Valid values: true, false'");
        });

        it("should return the true value for true filters", () => {
            const urlPath: string = "/rooms?isAvailable=true";
            const queryObj = parseUrlQuery(urlPath);

            const { filters, pagination } = parseQueryParams(
                queryObj, allowedFilters, 'Product'
            );

            expect(filters).toEqual({
                isAvailable: true
            })
        });

        it("should return the false value for false filters", () => {
            const urlPath: string = "/rooms?isAvailable=false";
            const queryObj = parseUrlQuery(urlPath);

            const { filters, pagination } = parseQueryParams(
                queryObj, allowedFilters, 'Product'
            );

            expect(filters).toEqual({
                isAvailable: false
            })
        });

        it("should return the exact boolean value if operator is 'equals'", () => {
            const urlPath: string = "/rooms?isAvailable[equals]=true";
            const queryObj = parseUrlQuery(urlPath);

            const { filters, pagination } = parseQueryParams(
                queryObj, allowedFilters, 'Product'
            );

            expect(filters).toEqual({
                isAvailable: true
            })
        });

    });

    describe('Number parameter Handling', () => {
        let mockCtx: MockContext;
        const allowedFilters = ['price'];
        beforeEach(() => {
            mockCtx = mockPrisma as unknown as MockContext;
            jest.clearAllMocks();
        });

        it("throws for invalid number operator", () => {
            const urlPath: string = "/rooms?price[INVALID]=12";
            const queryObj = parseUrlQuery(urlPath);

            expect(() => parseQueryParams(
                queryObj, allowedFilters, 'Product'
            )).toThrow("Invalid operator 'INVALID' for field 'price'. Valid operators: equals, gt, gte, lt, lte, in, notIn, not");
        });

        it("should return object with 'equals' as a key and passed number as the value", () => {
            const urlPath: string = "/rooms?price[equals]=50"
            const queryObj = parseUrlQuery(urlPath);

            const { filters, pagination } = parseQueryParams(
                queryObj, allowedFilters, 'Product'
            );

            expect(filters).toEqual({
                price: { equals: 50 }
            })
        });

        it("should return object with 'not' as a key and passed number as the value", () => {
            const urlPath: string = "/rooms?price[not]=50"
            const queryObj = parseUrlQuery(urlPath);

            const { filters, pagination } = parseQueryParams(
                queryObj, allowedFilters, 'Product'
            );

            expect(filters).toEqual({
                price: { not: 50 }
            })
        });

        it("should return object with 'gt' as a key and passed number as the value", () => {
            const urlPath: string = "/rooms?price[gt]=50"
            const queryObj = parseUrlQuery(urlPath);

            const { filters, pagination } = parseQueryParams(
                queryObj, allowedFilters, 'Product'
            );

            expect(filters).toEqual({
                price: { gt: 50 }
            })
        });

        it("should return object with 'gte' as a key and passed number as the value", () => {
            const urlPath: string = "/rooms?price[gte]=50"
            const queryObj = parseUrlQuery(urlPath);

            const { filters, pagination } = parseQueryParams(
                queryObj, allowedFilters, 'Product'
            );

            expect(filters).toEqual({
                price: { gte: 50 }
            })
        });

        it("should return object with 'lt' as a key and passed number as the value", () => {
            const urlPath: string = "/rooms?price[lt]=50"
            const queryObj = parseUrlQuery(urlPath);

            const { filters, pagination } = parseQueryParams(
                queryObj, allowedFilters, 'Product'
            );

            expect(filters).toEqual({
                price: { lt: 50 }
            })
        });

        it("should return object with 'lte' as a key and passed number as the value", () => {
            const urlPath: string = "/rooms?price[lte]=50"
            const queryObj = parseUrlQuery(urlPath);

            const { filters, pagination } = parseQueryParams(
                queryObj, allowedFilters, 'Product'
            );

            expect(filters).toEqual({
                price: { lte: 50 }
            })
        });

        it("should return object with 'in' as the key and number array as value for comma separated numbers", () => {

            const urlPath: string = "/rooms?price[in]=50,60";
            const queryObj = parseUrlQuery(urlPath);

            const { filters } = parseQueryParams(
                queryObj,
                allowedFilters,
                'Product'
            );

            expect(filters).toEqual({
                price: { in: [50, 60] }
            });
        });

        it("should return object with 'notIn' as the key and number array as value for a number", () => {
            const urlPath: string = "/rooms?price[notIn]=50,60";
            const queryObj = parseUrlQuery(urlPath);

            const { filters } = parseQueryParams(
                queryObj,
                allowedFilters,
                'Product'
            );

            expect(filters).toEqual({
                price: { notIn: [50, 60] }
            });
        });

    });

    describe('Enum Parameter Handling', () => {

        describe('Single Enum Field', () => {

            describe("Equals Operator", () => {
                it("throws for invalid enum value", () => {
                    const urlPath: string = "/rooms?status[equals]=INVALID";
                    const queryObj = parseUrlQuery(urlPath);

                    expect(() => parseQueryParams(
                        queryObj, allowedFilters, 'Product'
                    )).toThrow("Invalid enum value 'INVALID' for field 'status'. Valid values: ACTIVE, INACTIVE");
                });

                it("throws for multiple enum values (comma-separated)", () => {
                    const urlPath: string = "/rooms?status[equals]=SBG,SHM";
                    const queryObj = parseUrlQuery(urlPath);

                    expect(() => parseQueryParams(
                        queryObj, allowedFilters, 'Product'
                    )).toThrow("Invalid enum value 'SBG,SHM' for field 'status'. Valid values: ACTIVE, INACTIVE");
                });

                it("should return object with 'equals' as a key and Enum as the value", () => {

                    const urlPath: string = "/rooms?status[equals]=ACTIVE"
                    const queryObj = parseUrlQuery(urlPath);

                    const { filters, pagination } = parseQueryParams(
                        queryObj, allowedFilters, 'Product'
                    );

                    expect(filters).toEqual({
                        status: { equals: 'ACTIVE' }
                    })
                });
            });


            describe("Not Operator", () => {
                it("throws for invalid enum value", () => {
                    const urlPath: string = "/rooms?status[not]=INVALID";
                    const queryObj = parseUrlQuery(urlPath);

                    expect(() => parseQueryParams(
                        queryObj, allowedFilters, 'Product'
                    )).toThrow("Invalid enum value 'INVALID' for field 'status'. Valid values: ACTIVE, INACTIVE");
                });

                it("throws for multiple enum values (comma-separated)", () => {
                    const urlPath: string = "/rooms?status[not]=ACTIVE,INACTIVE";
                    const queryObj = parseUrlQuery(urlPath);

                    expect(() => parseQueryParams(
                        queryObj, allowedFilters, 'Product'
                    )).toThrow(/Invalid enum value 'ACTIVE,INACTIVE' for field 'status'. Valid values: ACTIVE, INACTIVE/);
                });

                it("should return object with 'not' as a key and Enum as the value", () => {

                    const urlPath: string = "/rooms?status[not]=ACTIVE"
                    const queryObj = parseUrlQuery(urlPath);

                    const { filters, pagination } = parseQueryParams(
                        queryObj, allowedFilters, 'Product'
                    );

                    expect(filters).toEqual({
                        status: { not: 'ACTIVE' }
                    })
                });
            });

            describe("In Operator", () => {
                it("throws for invalid enum value", () => {
                    const urlPath: string = "/rooms?status[in]=INVALID";
                    const queryObj = parseUrlQuery(urlPath);

                    expect(() => parseQueryParams(
                        queryObj, allowedFilters, 'Product'
                    )).toThrow(/Invalid enum values/);
                });

                it("should return object with 'in' as a key and the Enum in a array as value for single valid enum", () => {

                    // const urlPath: string = "/rooms?roomNumber[contains]__casesensitive=P210&status[in]=SBG"
                    const urlPath: string = "/rooms?status[in]=ACTIVE"
                    const queryObj = parseUrlQuery(urlPath);

                    const { filters, pagination } = parseQueryParams(
                        queryObj, allowedFilters, 'Product'
                    );

                    expect(filters).toEqual({
                        // roomNumber: { contains: 'P210', mode: 'default' },
                        status: { in: ['ACTIVE'] }
                    })
                });

                it("should return object with 'in' as a key and multiple Enums in a array as value for multiple valid enums", () => {

                    const urlPath: string = "/rooms?status[in]=ACTIVE,INACTIVE"
                    const queryObj = parseUrlQuery(urlPath);

                    const { filters, pagination } = parseQueryParams(
                        queryObj, allowedFilters, 'Product'
                    );

                    expect(filters).toEqual({
                        status: { in: ['ACTIVE', 'INACTIVE'] }
                    })
                });
            });

            describe("NotIn Operator", () => {
                it("throws for invalid enum value", () => {
                    const urlPath: string = "/rooms?status[notIn]=INVALID";
                    const queryObj = parseUrlQuery(urlPath);

                    expect(() => parseQueryParams(
                        queryObj, allowedFilters, 'Product'
                    )).toThrow(/Invalid enum values/);
                });

                it("should return object with 'notIn' as a key and the Enum in a array as value for single valid enum", () => {
                    const urlPath: string = "/rooms?status[notIn]=ACTIVE"
                    const queryObj = parseUrlQuery(urlPath);

                    const { filters, pagination } = parseQueryParams(
                        queryObj, allowedFilters, 'Product'
                    );

                    expect(filters).toEqual({
                        status: { notIn: ['ACTIVE'] }
                    })

                });

                it("should return object with 'notIn' as a key and multiple Enums in a array as value for multiple valid enums", () => {

                    const urlPath: string = "/rooms?status[notIn]=ACTIVE,INACTIVE"
                    const queryObj = parseUrlQuery(urlPath);

                    const { filters, pagination } = parseQueryParams(
                        queryObj, allowedFilters, 'Product'
                    );

                    expect(filters).toEqual({
                        status: { notIn: ['ACTIVE', 'INACTIVE'] }
                    })
                });
            });

        });

        describe('Multiple Enum Fields', () => {
            const allowedFilters = ['price', 'name'];

            it("throws for invalid enum value", () => {
                const urlPath: string = "/rooms?status[in]=ACTIVE&notAllowedField[in]=sample"
                const queryObj = parseUrlQuery(urlPath);

                expect(() => parseQueryParams(
                    queryObj, allowedFilters, 'Product'
                )).toThrow("Filtering by 'status' is not allowed. Allowed filters: price, name");
            });

            it("returns correct filter objects for multiple enum fields with single values", () => {
                const allowedFilters = ['price', 'status', 'shop'];
                const urlPath: string = "/rooms?status[in]=ACTIVE&shop[in]=SHOP-1"
                const queryObj = parseUrlQuery(urlPath);

                const { filters, pagination } = parseQueryParams(
                    queryObj, allowedFilters, 'Product'
                );

                expect(filters).toEqual({
                    shop: { in: ['SHOP-1'] },
                    status: { in: ['ACTIVE'] }
                })
            });

            it("returns correct filter objects for multiple enum fields with multiple values", () => {
                const allowedFilters = ['price', 'status', 'shop'];
                const urlPath: string = "/rooms?status[in]=ACTIVE&shop[in]=SHOP-1,SHOP-2"
                const queryObj = parseUrlQuery(urlPath);

                const { filters, pagination } = parseQueryParams(
                    queryObj, allowedFilters, 'Product'
                );

                expect(filters).toEqual({
                    shop: { in: ['SHOP-1', 'SHOP-2'] },
                    status: { in: ['ACTIVE'] }
                })
            });
        });

    });

    describe('Date parameter Handling', () => {
        let mockCtx: MockContext;
        const allowedFilters = ['createdAt', 'updatedAt'];

        beforeEach(() => {
            mockCtx = mockPrisma as unknown as MockContext;
            jest.clearAllMocks();
        });

        describe('Single Date Field', () => {
            it("throws for invalid date operator", () => {
                const urlPath: string = "/rooms?createdAt[INVALID]=2025-06-21";
                const queryObj = parseUrlQuery(urlPath);

                expect(() => parseQueryParams(
                    queryObj, allowedFilters, 'Product'
                )).toThrow("Invalid operator 'INVALID' for field 'createdAt'. Valid operators: equals, gt, gte, lt, lte");
            });

            it("throws for invalid date values", () => {
                const urlPath: string = "/rooms?createdAt[equals]=not-date-value";
                const queryObj = parseUrlQuery(urlPath);

                expect(() => parseQueryParams(
                    queryObj, allowedFilters, 'Product'
                )).toThrow("Invalid date value 'not-date-value' for field 'createdAt'. Valid format: YYYY-MM-DD or ISO 8601.");
            });

            it("should return a object with the equals operator as a key and date as the value", () => {
                const urlPath: string = "/rooms?createdAt[equals]=2025-06-21"
                const queryObj = parseUrlQuery(urlPath);

                const { filters, pagination } = parseQueryParams(
                    queryObj, allowedFilters, 'Product'
                );

                expect(filters).toEqual({
                    createdAt: { equals: "2025-06-21" }
                })
            });

            it("should return a object with the 'gt' operator as a key and date as the value", () => {
                const urlPath: string = "/rooms?createdAt[gt]=2025-06-21"
                const queryObj = parseUrlQuery(urlPath);

                const { filters, pagination } = parseQueryParams(
                    queryObj, allowedFilters, 'Product'
                );

                expect(filters).toEqual({
                    createdAt: { gt: "2025-06-21" }
                })
            });

            it("should return a object with the 'gte' operator as a key and date as the value", () => {
                const urlPath: string = "/rooms?createdAt[gte]=2025-06-21"
                const queryObj = parseUrlQuery(urlPath);

                const { filters, pagination } = parseQueryParams(
                    queryObj, allowedFilters, 'Product'
                );

                expect(filters).toEqual({
                    createdAt: { gte: "2025-06-21" }
                })
            });

            it("should return a object with the 'lt' operator as a key and date as the value", () => {
                const urlPath: string = "/rooms?createdAt[lt]=2025-06-21"
                const queryObj = parseUrlQuery(urlPath);

                const { filters, pagination } = parseQueryParams(
                    queryObj, allowedFilters, 'Product'
                );

                expect(filters).toEqual({
                    createdAt: { lt: "2025-06-21" }
                })
            });

            it("should return a object with the 'lte' operator as a key and date as the value", () => {
                const urlPath: string = "/rooms?createdAt[lte]=2025-06-21"
                const queryObj = parseUrlQuery(urlPath);

                const { filters, pagination } = parseQueryParams(
                    queryObj, allowedFilters, 'Product'
                );

                expect(filters).toEqual({
                    createdAt: { lte: "2025-06-21" }
                })
            });

        });

        describe('Multiple Date Fields', () => {
            it("throws for invalid date operator if any of them is invalid", () => {
                const urlPath: string = "/rooms?createdAt[INVALID]=2025-06-21&updatedAt[equals]=2025-06-22";
                const queryObj = parseUrlQuery(urlPath);

                expect(() => parseQueryParams(
                    queryObj, allowedFilters, 'Product'
                )).toThrow("Invalid operator 'INVALID' for field 'createdAt'. Valid operators: equals, gt, gte, lt, lte");
            });

            it("throws for invalid date values if any of them is invalid", () => {
                const urlPath: string = "/rooms?createdAt[equals]=2025-06-22&updatedAt[equals]=not-date-value";
                const queryObj = parseUrlQuery(urlPath);

                expect(() => parseQueryParams(
                    queryObj, allowedFilters, 'Product'
                )).toThrow("Invalid date value 'not-date-value' for field 'updatedAt'. Valid format: YYYY-MM-DD or ISO 8601.");
            });

            it("should return a object with the equals operator as a key and date as the value for every dates", () => {
                const urlPath: string = "/rooms?createdAt[equals]=2025-06-21&updatedAt[gt]=2025-06-22"
                const queryObj = parseUrlQuery(urlPath);

                const { filters, pagination } = parseQueryParams(
                    queryObj, allowedFilters, 'Product'
                );

                expect(filters).toEqual({
                    createdAt: { equals: "2025-06-21" },
                    updatedAt: { gt: "2025-06-22" },
                })
            });
        });
    })

});