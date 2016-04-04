"use strict";

describe ("myapp.factories.course", function ()
{
    beforeEach (module ("myapp.factories.course", "myapp.factories.section", "myapp.factories.paragraph", "myapp.services.content"));

    var Section;
    var Course;
    var Paragraph;


    var ContentService;

    beforeEach (inject (function (_Course_, _Section_, _Paragraph_,_ContentService_)
    {
        Course = _Course_;
        Section = _Section_;
        Paragraph = _Paragraph_;
        ContentService = _ContentService_;
    }));

    var course_title;
    var course_period;
    var course_description;
    var course;
    var section_1;
    var section_2;

    var section_1_paragraph_1;
    var section_2_paragraph_1;

    beforeEach (function ()
    {
        course_title = "FMI Course";
        course_period = "2016";
        course_description = "This course is about formal methods";

        course = new Course ("fmi", course_title, course_period, course_description);

        section_1 = course.insert (new Section ("Section 1", "Section Description 1"));
        section_2 = course.insert (new Section ("Section 2", "Section Description 2"));

        section_1_paragraph_1 = section_1.insert (new Paragraph ('text', "Paragraph 1 in section 1"));
        section_2_paragraph_1 = section_2.insert (new Paragraph ('text', "Paragraph 1 in section 2"));
    });

    it ("should create a course", function ()
    {
        expect (course.title).toEqual (course_title);
        expect (course.period).toEqual (course_period);
        expect (course.description).toEqual (course_description);
    });

    it ("should use get_entry to find the section", function ()
    {
        expect (course.get_entry (section_1.id)).toEqual(section_1);
    });


    it ("should have a sibling", function ()
    {
        expect (section_1.has_next_sibling ()).toEqual (true);
    });

    it ("should return the next sibling", function ()
    {
        expect (section_1.next_sibling()).toEqual(section_2);
    });

    it ("should enumerate the sub tree", function ()
    {
        var content = new ContentService (section_1,
                                          function never_block (entry) { return false; },
                                          function filter_nothing (entry ) { return true; });

        var entries = content.enumerate_subtree();

        expect (entries.length).toEqual(2);
        expect (entries[0]).toEqual (section_1);
        expect (entries[1]).toEqual (section_1_paragraph_1);
    });

    it ("should enumerate the whole tree", function ()
    {
        var content = new ContentService (section_1,
                                          function never_block (entry) { return false; },
                                          function filter_nothing (entry ) { return true; });


        var entries = content.enumerate_tree ();
        expect (entries.length).toEqual (4);

        expect (entries[0]).toEqual (section_1);
        expect (entries[1]).toEqual (section_1_paragraph_1);
        expect (entries[2]).toEqual (section_2);
        expect (entries[3]).toEqual (section_2_paragraph_1);
    })
});
