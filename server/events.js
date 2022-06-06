var config = 
{
	globalVars: [
		{
			name:"a",
			type:"int",
			value:0
		},
		{
			name:"b",
			type:"int",
			value:5
		}
	],
	globalEvents: [
		{
			condition: {
				type:"bool",
				value:true
			},
			action: {
				type:"multi",
				subActions: [
					{
						type:"=",
						children: [
							{
								type:"globalVar",
								children: [
									{
										type: "string",
										value: "a"
									}
								]
							},
							{
								type:"+",
								children: [
									{
										type:"globalVar",
										children: [
											{
												type: "string",
												value: "a"
											}
										]
									},
									{
										type:"number",
										value: 10
									}
								]
							}
						]
					},
					{
						type:"=",
						children: [
							{
								type:"globalVar",
								children: [
									{
										type: "string",
										value: "a"
									}
								]
							},
							{
								type:"+",
								children: [
									{
										type:"globalVar",
										children: [
											{
												type: "string",
												value: "a"
											}
										]
									},
									{
										type:"number",
										value:2
									}
								]
							}
						]						
					}
				]
			}		
		},
		{
			condition: {
				type:">=",
				children: [
					{
						type:"abs",
						children: [
							{
								type:"globalVar",
								variable:"a"	
							}
						]
					},
					{
						type:"number",
						value: 20
					}
				]
			},
			action: {
				type:"=",
				children: [
					{
						type:"globalVar",
						variable:"b",
					},
					{
						type:"*",
						children: [
							{
								type:"globalVar",
								variable:"b"
							},
							{
								type:"number",
								value:-1
							}
						]
					}
				]
			}
		}
	],
	objectTypes: {
		player: {
			vars:[
				{
					name:"id",
					type:"int",
					value:0
				},
				{
					name:"health",
					type:"int",
					value:0
				},
				{
					name:"x",
					type:"int",
					value:0
				},
				{
					name:"y",
					type:"int",
					value:0
				}
			],
			events:[
				{
					condition: {
						type:"bool",
						value:true
					},
					action: {
						type:"multi",
						subActions: [
							{
								type:"=",
								children: [
									{
										type: "objectVar",
										children: [
											{
												type: "string",
												value: "health"
											}
										]
									},
									{
										type:"+",
										children: [
											{
												type:"objectVar",
												variable:"health"
											},
											{
												type:"number",
												value:10
											}
										]
									}
								]
							},
							{
								type:"=",
								variableType:"object",
								variable:"x",
								exp: {
									type:"+",
									left:{
										type:"var",
										variableType:"object",
										variable:"x"
									},
									right:{
										type:"number",
										value:3
									}
								}
							},
							{
								type:"=",
								variableType:"object",
								variable:"y",
								exp: {
									type:"+",
									left:{
										type:"var",
										variableType:"object",
										variable:"y"
									},
									right:{
										type:"number",
										value:2
									}
								}
							}
						]
					}
				},
				{
					condition: {
						type:">=",
						left: {
							type:"var",
							variableType:"object",
							variable:"x"
						},
						right: {
							type:"number",
							value: 7
						}
					},
					action: {
						type:"=",
						variableType:"object",
						variable:"health",
						exp: {
							type:"/",
							left:{
								type:"var",
								variableType:"object",
								variable:"health"
							},
							right:{
								type:"number",
								value:2
							}
						}
					}
				}
			]
		},
		environment: {
			vars: [
				{
					name:"id",
					type:"int",
					value:0
				},
				{
					name:"x",
					type:"int",
					value:0
				},
				{
					name:"y",
					type:"int",
					value:0
				}
			],
			events: [
				{
					condition: {
						type:"<=",
						left: {
							type:"var",
							variableType:"object",
							variable:"x"
						},
						right: {
							type:"number",
							value: 100
						}
					},
					action: {
						type:"multi",
						subActions: [
							{
								type:"=",
								variableType:"object",
								variable:"x",
								exp: {
									type:"+",
									left:{
										type:"var",
										variableType:"object",
										variable:"x"
									},
									right:{
										type:"number",
										value:0.1
									}
								}
							},
							{
								type:"=",
								variableType:"object",
								variable:"y",
								exp: {
									type:"+",
									left:{
										type:"var",
										variableType:"object",
										variable:"y"
									},
									right:{
										type:"number",
										value:0.1
									}
								}
							},
							{
								type:"=ObjectPos",
								objId: {
									type:"stringLiteral",
									value:"18"
								},
								x:{
									type:"var",
									variableType:"object",
									variable:"x"
								},
								y:{
									type:"var",
									variableType:"object",
									variable:"y"
								}
							}
						]
					}	
				}
			]
		},
		npc: {
			var:[
				{
					name:"id",
					type:"int",
					value:0
				},
				{
					name:"health",
					type:"int",
					value:0
				},
				{
					name:"x",
					type:"int",
					value:0
				},
				{
					name:"y",
					type:"int",
					value:0
				},
				{
					name:"isFriendly",
					type:"bool",
					value:true
				}
			],
			events: [
				{
					condition: {
						type:"&&",
						left: {
							type:"==",
							left: {
								type:"var",
								variableType:"object",
								variable:"isFriendly"
							},
							right: {
								type:"bool",
								value: false
							}
						},
						right: {
							type:"!=",
							left: {
								type:"=Tmp",
								name:"closest",
								value: {
									type:"closestObject",
									maxDistance: {
										type:"number",
										value:20
									},
									condition: {
										type:"==",
										left: {
											type:"field",
											obj: {
												type:"tmpVar",
												children: [
													{
														type:"stringLiteral",
														value:"obj"
													}
												]
												
											},
											field: "type"
										},
										right: {
											type:"stringLiteral",
											value:"player"
										}
									}
								}
							},
							right: {
								type:"null"
							}
						}
					},
					action: {
						type:"=ObjectPos",
						objId: {
							type:"field",
							obj: {
								type:"tmpVar",
								name:"closest"
							},
							field: "id"
						},
						x: {
							type:"intValue",
							value:50
						},
						y: {
							type:"intValue",
							value:50
						}
					}
				}
			]
		}

	}
};
exports.config = config;

var objects = [
	{
		type:"player",
		vars:[
			{
				name:"id",
				type:"int",
				value:0
			},
			{
				name:"health",
				type:"int",
				value:0
			},
			{
				name:"x",
				type:"int",
				value:8
			},
			{
				name:"y",
				type:"int",
				value:4
			}
		]
	},{
		type:"player",
		vars:[
			{
				name:"id",
				type:"int",
				value:0
			},
			{
				name:"health",
				type:"int",
				value:0
			},
			{
				name:"x",
				type:"int",
				value:0
			},
			{
				name:"y",
				type:"int",
				value:0
			}
		]
	},
	{
		type:"npc",
		vars:[
			{
				name:"id",
				type:"int",
				value:1
			},
			{
				name:"health",
				type:"int",
				value:0
			},
			{
				name:"x",
				type:"int",
				value:12
			},
			{
				name:"y",
				type:"int",
				value:5
			},
			{
				name:"isFriendly",
				type:"bool",
				value:false
			}
		]
	},
	{
		type:"environment",
		vars:[
			{
				name:"id",
				type:"int",
				value:0
			},
			{
				name:"x",
				type:"int",
				value:14
			},
			{
				name:"y",
				type:"int",
				value:2
			}
		]
	}
];
exports.objects = objects;