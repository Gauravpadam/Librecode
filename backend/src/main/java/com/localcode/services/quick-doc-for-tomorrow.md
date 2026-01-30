## So

The design is incorrect
Storing input types is not going to work for two reasons:
1. Storing them, retrieving them and mapping them to the input types of all languages' across parameters is not going to work from a generation pov. Why? parser generators currently depend on these types. Then we would have to map the params to input types and then fetch the input parsers
1. It is much simpler to maintain enums per language, for the datatype with it's logical equivalence of parsing method. For instance: Character array and List<String> both would be parsed in a similar fashion. This makes mapping params with their respective 

## Now, I gave it a second thought and the design might not be flawed at all; it is incomplete

Persist all types in a problem. This would solve two things, you would have paramcount. You would also have the correct input types to call the parsing generators

The tradeoff? Store accuractely, the types of inputs should be precise. A dependency on the user creating the problem, not good. Solve it thru restrictions and the ux suffers. Force the users to think in terms of your enums

## Verdict

I would change the persistence, it doesn't make sense to store things once the starter code is defined. The design is flawed, conceptually. Let it be a brawl on the enums, we could maintain that until we can't. At least 3 am architect brain of mine thinks so.
Let's see what the 7 am distinguished engineer would see.

Peace out, this will probably get deleted in commits, however i'll keep the delete commit
as an easter egg for the repository
